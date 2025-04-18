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
      { new: true, session }
    );

    if (!booking) {
      await session.abortTransaction();
      return errorResponse(res, 400, "متاسفانه این نوبت قبلا رزرو شده است.");
    }

    const selectedTime = booking.availableTimes.find(
      (item) => item._id.toString() === id.toString()
    );

    const bookedSessions = await bookingModel.findOne({
      user: user._id,
      psychologistID: booking.psychologistID,
      date: booking.date,
    });

    if (bookedSessions) {
      bookedSessions.time.push(selectedTime.time);
      await bookedSessions.save({ session });
    } else {
      await bookingModel.create(
        [
          {
            user: user._id,
            psychologistID: booking.psychologistID,
            date: new Date(booking.date),
            time: selectedTime.time,
            status: "reserved",
          },
        ],
        { session }
      );
    }

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

    await session.commitTransaction();

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
