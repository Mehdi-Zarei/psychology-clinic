//* Bcrypt Helper
const { hashData, comparHashedData } = require("../../../helper/bcrypt");

//* jwt Helper
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../helper/jwtTokens");

//* Redis Helpers
const {
  getOtpInfo,
  saveData,
  removeData,
  getData,
} = require("../../../helper/redis");

//* Response Messages
const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

//* Services
const sentSms = require("../../../service/otp");

const userModel = require("../../../model/User");
const psychologistModel = require("../../../model/Psychologist");

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

    await saveData(`otp:${phone}`, generateOtpCode, 60);

    const smsResult = await sentSms(phone, generateOtpCode);
    if (smsResult.success) {
      return successResponse(
        res,
        200,
        "کد ورود به شماره موبایل وارد شده باموفقیت ارسال گردید."
      );
    } else {
      await removeData(`otp:${phone}`);

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
    const { otpCode, phone } = req.body;

    const storedOtp = await getData(`otp:${phone}`);

    if (storedOtp.expired || storedOtp !== otpCode) {
      return errorResponse(
        res,
        403,
        "کد وارد شده صحیح نمی باشد و یا مدت زمان آن به پایان رسیده است."
      );
    }

    const isUserExist = await userModel.findOne({ phone }).lean();

    if (isUserExist) {
      if (isUserExist.isRestrict) {
        return errorResponse(res, 403, "حساب کاربری شما مسدود شده است.");
      }

      const accessToken = await generateAccessToken(
        isUserExist._id,
        isUserExist.role
      );

      const refreshToken = await generateRefreshToken(isUserExist._id);

      const encryptRefreshToken = await hashData(refreshToken);

      await saveData(
        `refreshToken:${isUserExist._id}`,
        encryptRefreshToken,
        2592000
      );

      await removeData(`otp:${phone}`);

      return successResponse(
        res,
        200,
        "شما با موفقیت وارد حساب کاربری خود شدید.",
        { accessToken, refreshToken }
      );
    } else {
      return errorResponse(res, 404, "Redirect To Register Page.");
    }
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const isUserExist = await userModel
      .findOne({ $or: [{ email }, { phone }] })
      .lean();

    if (isUserExist) {
      return errorResponse(
        res,
        409,
        "این آدرس ایمیل و یا شماره موبایل تکراری است."
      );
    }

    const hashPassword = password ? await hashData(password) : password;

    console.log("hashPassword->", hashPassword);

    const isFirstUser = (await userModel.countDocuments()) === 0;

    const newUser = await userModel.create({
      name,
      email,
      phone,
      password: hashPassword,
      role: isFirstUser ? "ADMIN" : "USER",
      isRestrict: false,
    });

    const accessToken = await generateAccessToken(newUser._id, newUser.role);

    const refreshToken = await generateRefreshToken(newUser._id);

    const encryptRefreshToken = await hashData(refreshToken);

    await saveData(`refreshToken:${newUser._id}`, encryptRefreshToken, 2592000);

    return successResponse(res, 201, "ثبت نام با موفقیت انجام شد.", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel
      .findOne({ $or: [{ email: identifier }, { phone: identifier }] })
      .lean();

    if (!user) {
      return errorResponse(res, 404, "حساب کاربری پیدا نشد.");
    }

    if (user.isRestrict) {
      return errorResponse(res, 403, "حساب کاربری شما مسدود شده است.");
    }

    if (!user.password) {
      return errorResponse(
        res,
        403,
        "برای ورود ابتدا باید رمز عبور تنظیم کنید. لطفاً از طریق کد یکبارمصرف وارد حساب کاربری خود شویدو از طریق پروفایل خود یک رمز عبور تعیین کنید."
      );
    }

    const verifyPassword = await comparHashedData(password, user.password);

    if (!verifyPassword) {
      return errorResponse(res, 403, "نام کاربری و یا رمز عبور صحیح نمی باشد.");
    }

    const accessToken = await generateAccessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id);
    const hashRefreshToken = await hashData(refreshToken);
    await saveData(`refreshToken:${user._id}`, hashRefreshToken, 2592000);

    return successResponse(
      res,
      200,
      "شما با موفقیت وارد حساب کاربری خودتون شدید.",
      { accessToken, refreshToken }
    );
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = req.user;

    await removeData(`refreshToken:${user._id}`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return successResponse(
      res,
      200,
      "شما با موفقیت از حساب کاربری خود خارج شدید."
    );
  } catch (error) {
    next(error);
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = await generateAccessToken(user._id, user.role);

    return successResponse(res, 200, accessToken);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    const isPsychologist = await psychologistModel.findOne({
      psychologistID: user._id,
    });

    if (isPsychologist) {
      return successResponse(res, 200, { user, isPsychologist });
    }

    return successResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, aboutMe } = req.body;
    const user = req.user;

    const mainUser = await userModel.findOne({ _id: user._id });

    mainUser.name = name || mainUser.name;
    mainUser.email = email || mainUser.email;

    const isPsychologist = await psychologistModel.findOne({
      psychologistID: user._id,
    });

    let avatar = "";

    if (req.file) {
      avatar = `public/images/profile/${req.file.filename}`;
    }

    isPsychologist.aboutMe = aboutMe || isPsychologist.aboutMe;
    isPsychologist.avatar = avatar || isPsychologist.avatar;

    await mainUser.save();
    await isPsychologist.save();

    return successResponse(res, 200, "پروفایل شما با موفقیت بروزرسانی گردید.");
  } catch (error) {
    next(error);
  }
};
