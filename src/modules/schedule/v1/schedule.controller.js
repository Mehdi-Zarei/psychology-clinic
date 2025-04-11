const { isValidObjectId } = require("mongoose");
const {
  successResponse,
  errorResponse,
} = require("../../../helper/responseMessage");

const scheduleModel = require("../../../model/Schedule");

exports.setAvailableTime = async (req, res, next) => {
  try {
    const { date, availableTimes } = req.body;
    const user = req.user;
    const newTimes = availableTimes.map((available) => available.time);

    const existingTime = await scheduleModel.findOne({
      psychologist: user._id,
      date: new Date(date),
      "availableTimes.time": { $in: newTimes },
    });

    if (existingTime) {
      return errorResponse(
        res,
        409,
        " ساعت ملاقات قبلا برای این تاریخ ثبت شده است."
      );
    }

    const existingDate = await scheduleModel.findOneAndUpdate(
      { psychologist: user._id, date: new Date(date) },
      { $push: { availableTimes } }
    );

    const setExpireDate = new Date(date);
    setExpireDate.setHours(23, 59, 59, 999);

    if (!existingDate) {
      await scheduleModel.create({
        psychologist: user._id,
        date: new Date(date),
        availableTimes,
        expiresAt: setExpireDate,
      });
    }

    return successResponse(
      res,
      201,
      "زمان مورد نظر با موفقیت ثبت شد و در دسترس مراجعین قرار گرفت."
    );
  } catch (error) {
    next(error);
  }
};

exports.getAvailableTime = async (req, res, next) => {
  try {
    const user = req.user;

    const appointments = await scheduleModel
      .find({ psychologist: user._id })
      .populate("psychologist", "name")
      .select("-__v")
      .lean();

    if (!appointments.length) {
      return errorResponse(res, 404, "قرار ملاقات یافت نشد.");
    }

    return successResponse(res, 200, appointments);
  } catch (error) {
    next(error);
  }
};

exports.editAppointmentDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی ارسال شده صحیح نمی باشد!");
    }

    const update = await scheduleModel.findOneAndUpdate(
      { _id: id, psychologist: user._id },
      { date: new Date(date) }
    );

    if (!update) {
      return errorResponse(
        res,
        404,
        "در این تاریخ ، هیچ گونه زمان ملاقاتی یافت نشد!"
      );
    }

    return successResponse(res, 200, "تاریخ ملاقات با موفقیت  بروزرسانی شد.");
  } catch (error) {
    next(error);
  }
};

exports.editAppointmentTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newTime } = req.body;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی ارسال شده صحیح نمی باشد!");
    }

    const update = await scheduleModel.findOneAndUpdate(
      {
        psychologist: user._id,
        "availableTimes._id": id,
      },
      {
        $set: {
          "availableTimes.$.time": newTime.time,
          "availableTimes.$.isBooked": newTime.isBooked,
        },
      }
    );

    if (!update) {
      return errorResponse(res, 404, "زمان ملاقات یافت نشد!");
    }

    return successResponse(res, 200, "زمان ملاقات با موفقیت آپدیت شد.");
  } catch (error) {
    next(error);
  }
};

exports.removeAppointmentDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی ارسال شده صحیح نمی باشد!");
    }

    const remove = await scheduleModel.findOneAndDelete({
      _id: id,
      psychologist: user._id,
    });

    if (!remove) {
      return errorResponse(res, 404, "هیچ گونه زمان ملاقاتی پیدا نشد!");
    }

    return successResponse(res, 200, "زمان ملاقات مورد نظر با موفقیت حذف شد.");
  } catch (error) {
    next(error);
  }
};
