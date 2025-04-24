const { isValidObjectId, default: mongoose } = require("mongoose");

const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

const bookingModel = require("../../../model/Booking");
const scheduleModel = require("../../../model/Schedule");
const userModel = require("../../../model/User");

const sentSms = require("../../../service/otp");
const envConfigs = require("../../../envConfigs");
const setBookingJob = require("../../../utils/setBookingJob");

exports.getAll = async (req, res, next) => {
  try {
    const user = req.user;

    const filter = user.role === "ADMIN" ? {} : { user: user._id };

    const reservations = await bookingModel
      .find(filter)
      .populate("user", "name")
      .populate("psychologistID", "name")
      .select("-__v")
      .lean();

    if (!reservations.length) {
      return errorResponse(res, 404, "زمان ملاقات یافت نشد.");
    }

    return successResponse(res, 200, reservations);
  } catch (error) {
    next(error);
  }
};

exports.bookingAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const booking = await scheduleModel.findOneAndUpdate(
      {
        availableTimes: {
          $elemMatch: {
            _id: id,
            isBooked: false,
          },
        },
      },
      { $set: { "availableTimes.$.isBooked": true } },
      { session }
    );

    if (!booking) {
      await session.abortTransaction();
      return errorResponse(res, 400, "متاسفانه این نوبت قبلا رزرو شده است.");
    }

    const startTime = booking.availableTimes.find(
      (item) => item._id.toString() === id.toString()
    );

    const endTime = new Date(startTime.time);
    endTime.setMinutes(endTime.getMinutes() + 50);

    const bookedSessions = await bookingModel.findOne({
      user: user._id,
      psychologistID: booking.psychologistID,
      date: booking.date,
    });

    if (bookedSessions) {
      const newSlot = {
        startTime: startTime.time,
        endTime,
        status: "reserved",
        availableTimeId: startTime._id,
      };

      bookedSessions.time.push(newSlot);
      await bookedSessions.save({ session });

      setBookingJob(bookedSessions);
    } else {
      const [newBooking] = await bookingModel.create(
        [
          {
            user: user._id,
            psychologistID: booking.psychologistID,
            date: new Date(booking.date),
            time: [
              {
                startTime: startTime.time,
                endTime,
                status: "reserved",
                availableTimeId: startTime._id,
              },
            ],
          },
        ],
        { session }
      );
      setBookingJob(newBooking);
    }

    await session.commitTransaction();

    const psychologist = await userModel
      .findOne({
        _id: booking.psychologistID,
      })
      .lean();

    await sentSms(
      psychologist.phone,
      envConfigs.otp.psychologistReminderPattern,
      envConfigs.otp.psychologistReminderVariable,
      psychologist.name
    );

    return successResponse(res, 201, "نوبت شما با موفقیت ثبت شد.");
  } catch (error) {
    next(error);
    await session.abortTransaction();
    return errorResponse(
      res,
      400,
      "متاسفانه رزرو نوبت با خطا مواجه شد.لطفا مجددا سعی نمایید."
    );
  } finally {
    await session.endSession();
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const cancel = await bookingModel.findOneAndUpdate(
      {
        user: user._id,
        time: { $elemMatch: { _id: id, status: "reserved" } },
      },
      { $set: { "time.$.status": "canceled" } }
    );

    if (!cancel) {
      return errorResponse(res, 409, "این زمان ملاقات قبلا لغو شده است.");
    }

    const startTime = cancel.time.find((item) => item._id.toString() === id);

    await scheduleModel.findOneAndUpdate(
      { "availableTimes._id": startTime.availableTimeId },
      { $set: { "availableTimes.$.isBooked": false } }
    );

    const psychologist = await userModel.findOne({
      _id: cancel.psychologistID,
    });

    await sentSms(
      psychologist.phone,
      envConfigs.otp.psychologistReminderPattern,
      envConfigs.otp.psychologistReminderVariable
    );

    return successResponse(res, 200, "زمان ملاقات شما با موفقیت لغو گردید.");
  } catch (error) {
    next(error);
  }
};
