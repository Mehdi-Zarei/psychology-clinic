const { isValidObjectId, default: mongoose } = require("mongoose");
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

    const register = await psychologistModel.create({
      psychologistID,
      education,
      licenseNumber,
      aboutMe,
      specialization,
      experienceYears,
      avatar: `public/images/profile/${req.file.filename}`,
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
      .select("avatar education specialization rating");

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
      .select("-reviews")
      .lean();

    if (!psychologist) {
      return errorResponse(res, 404, "متاسفانه روانشناسی یافت نشد.");
    }

    const today = new Date();

    const schedules = await scheduleModel.aggregate([
      {
        $match: {
          psychologistID: mongoose.Types.ObjectId.createFromHexString(id),
          date: { $gte: today },
        },
      },
      {
        $project: {
          date: 1,
          availableTimes: {
            $filter: {
              input: "$availableTimes",
              as: "slot",
              cond: { $eq: ["$$slot.isBooked", false] },
            },
          },
        },
      },
    ]);

    if (!schedules.length) {
      return successResponse(
        res,
        200,
        psychologist,
        "متاسفانه نوبت قابل رزرو برای این روانشناس یافت نشد. "
      );
    }

    return successResponse(res, 200, psychologist, schedules);
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
