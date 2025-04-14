const { isValidObjectId } = require("mongoose");
const psychologistModel = require("../../../model/Psychologist");
const scheduleModel = require("../../../model/Schedule");
const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

exports.register = async (req, res, next) => {
  try {
    const {
      psychologistID,
      education,
      licenseNumber,
      aboutMe,
      specialization,
      experienceYears,
    } = req.body;

    if (!isValidObjectId(psychologistID)) {
      return errorResponse(res, 409, "شناسه کاربری صحیح نمی باشد.");
    }

    const isPsychologistExist = await psychologistModel
      .findOne({ licenseNumber })
      .lean();

    if (isPsychologistExist) {
      return errorResponse(
        res,
        409,
        ".این کاربر قبلا به عنوان روانشناس ثبت نام شده است(شماره نظام روانشناسی تکراری است)"
      );
    }

    console.log(req.file);

    let avatar = "";

    if (req.file) {
      avatar = `public/images/profile/${req.file.filename}`;
    }
    const register = await psychologistModel.create({
      psychologistID,
      education,
      licenseNumber,
      aboutMe,
      specialization,
      experienceYears,
      avatar,
    });

    return successResponse(res, 201, "ثبت نام با موفقیت انجام شد", register);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const psychologists = await psychologistModel
      .find({})
      .populate("psychologistID", "name")
      .lean()
      .select("-__v");

    if (!psychologists.length) {
      return errorResponse(res, 404, "متاسفانه روانشناسی یافت نشد.");
    }

    return successResponse(res, 200, psychologists);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const psychologist = await psychologistModel
      .findOne({ psychologistID: id })
      .populate("psychologistID", "name")
      .lean()
      .select("-__v");

    if (!psychologist) {
      return errorResponse(res, 404, "متاسفانه روانشناسی یافت نشد.");
    }

    const today = new Date();

    const availableTime = await scheduleModel
      .find({
        psychologistID: id,
        date: { $gte: today },
      })
      .select("availableTimes date");

    if (!availableTime.length) {
      return successResponse(
        res,
        200,
        psychologist,
        "متاسفانه نوبت قابل رزرو برای این روانشناس یافت نشد. "
      );
    }

    return successResponse(res, 200, psychologist, availableTime);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const removePsychologist = await psychologistModel.findOneAndDelete({
      psychologistID: id,
    });

    const removeSchedulesTime = await scheduleModel.deleteMany({
      psychologistID: id,
    });

    if (!removePsychologist && !removeSchedulesTime.deletedCount) {
      return errorResponse(res, 404, "روانشناس یافت نشد.");
    }

    return successResponse(res, 200, "روانشناس با موفقیت حذف شد.");
  } catch (error) {
    next(error);
  }
};
