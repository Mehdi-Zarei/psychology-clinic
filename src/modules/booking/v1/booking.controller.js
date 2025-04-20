const { isValidObjectId, default: mongoose } = require("mongoose");

const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

const bookingModel = require("../../../model/Booking");
const scheduleModel = require("../../../model/Schedule");
const psychologistModel = require("../../../model/Psychologist");
const userModel = require("../../../model/User");

const sentSms = require("../../../service/otp");
const envConfigs = require("../../../envConfigs");

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
      bookedSessions.time.push({
        startTime: startTime.time,
        endTime,
        status: "reserved",
        availableTimeId: startTime._id,
      });

      await bookedSessions.save({ session });
    } else {
      await bookingModel.create(
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

exports.getReviews = async (req, res, next) => {
  try {
    const user = req.user;

    const filter =
      user.role === "ADMIN"
        ? {}
        : {
            reviews: { $elemMatch: { user: user._id } },
          };

    const allReviews = await psychologistModel
      .find(filter)
      .populate("psychologistID", "name")
      .select("avatar rating reviews");

    if (!allReviews.length) {
      return errorResponse(res, 400, "شما تاکنون نظری ثبت نکرده اید.");
    }

    return successResponse(res, 200, allReviews);
  } catch (error) {
    next(error);
  }
};
