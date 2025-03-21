//* Redis Helpers
const { getOtpInfo, saveOtp, removeOtp } = require("../../../helper/redis");

//* Response Messages
const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

//* Services
const sentSms = require("../../../service/otp");

const userModel = require("./auth.model");

exports.sentOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const isUserExist = await userModel.findOne({ phone }).lean();

    if (isUserExist?.isRestrict) {
      return errorResponse(res, 409, "حساب کاربری این کاربر مسدود شده است.");
    }

    const { remainingTime, expired } = await getOtpInfo(phone);

    if (!expired) {
      return errorResponse(
        res,
        409,
        `کد یکبارمصرف قبلا برای شما ارسال گردیده است.لطفا پس از ${remainingTime} مجدد تلاش کنید.`
      );
    }

    const generateOtpCode =
      Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    console.log(generateOtpCode); //TODO: Remove log

    await saveOtp(phone, generateOtpCode);

    const smsResult = await sentSms(phone, generateOtpCode);
    if (smsResult.success) {
      return successResponse(
        res,
        200,
        "کد ورود به شماره موبایل وارد شده باموفقیت ارسال گردید."
      );
    } else {
      await removeOtp(phone);

      return errorResponse(
        res,
        500,
        "خطا در ارسال کد یکبار مصرف،لطفا مجدد تلاش فرمائید."
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.loginWithOtp = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.gtMe = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
