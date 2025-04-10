const Joi = require("joi");

const sentOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.empty": "شماره تلفن نمی‌تواند خالی باشد.",
      "string.pattern.base":
        "شماره تلفن باید با 09 شروع شود و 11 رقم طول داشته باشد.",
      "any.required": "شماره تلفن الزامی است.",
    }),
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.empty": "شماره تلفن نمی‌تواند خالی باشد.",
      "string.pattern.base":
        "شماره تلفن باید با 09 شروع شود و 11 رقم طول داشته باشد.",
      "any.required": "شماره تلفن الزامی است.",
    }),

  otpCode: Joi.string().length(5).required().messages({
    "string.base": "کد باید به صورت عدد باشد.",
    "string.length": "کد باید دقیقا ۵ رقم باشد.",
    "string.empty": "لطفاً کد را وارد کنید.",
    "any.required": "وارد کردن کد الزامی است.",
  }),
});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "نام باید به صورت رشته باشد.",
    "string.min": "نام باید حداقل ۳ کاراکتر باشد.",
    "string.max": "نام نباید بیشتر از ۱۰۰ کاراکتر باشد.",
    "string.empty": "نام الزامی است.",
    "any.required": "نام الزامی است.",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "ایمیل باید به صورت رشته باشد.",
    "string.email": "ایمیل وارد شده معتبر نیست.",
    "string.empty": "ایمیل الزامی است.",
    "any.required": "ایمیل الزامی است.",
  }),

  phone: Joi.string()
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.empty": "شماره تلفن نمی‌تواند خالی باشد.",
      "string.pattern.base":
        "شماره تلفن باید با 09 شروع شود و 11 رقم طول داشته باشد.",
      "any.required": "شماره تلفن الزامی است.",
    }),

  password: Joi.string().min(8).max(20).required().messages({
    "string.base": "رمز عبور باید به صورت رشته باشد.",
    "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
    "string.max": "رمز عبور نباید بیشتر از ۲۰ کاراکتر باشد.",
    "string.empty": "رمز عبور الزامی است.",
    "any.required": "رمز عبور الزامی است.",
  }),
});

const loginSchema = Joi.object({
  identifier: Joi.string()
    .required()
    .custom((value, helpers) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^09[0-9]{9}$/;

      if (emailPattern.test(value)) {
        return value;
      } else if (phonePattern.test(value)) {
        return value;
      }

      return helpers.message("ایمیل یا شماره تلفن وارد شده معتبر نیست.");
    })
    .messages({
      "string.empty": "ایمیل یا شماره تلفن الزامی است.",
      "any.required": "ایمیل یا شماره تلفن الزامی است.",
    }),

  password: Joi.string().min(8).max(20).required().messages({
    "string.base": "رمز عبور باید به صورت رشته باشد.",
    "string.min": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
    "string.max": "رمز عبور نباید بیشتر از ۲۰ کاراکتر باشد.",
    "string.empty": "رمز عبور الزامی است.",
    "any.required": "رمز عبور الزامی است.",
  }),
});

module.exports = {
  sentOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
};
