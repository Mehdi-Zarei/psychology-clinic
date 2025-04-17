const Joi = require("joi");

const psychologistSchema = Joi.object({
  psychologistID: Joi.string().required().messages({
    "any.invalid": "شناسه کاربر معتبر نیست.",
    "any.required": "شناسه کاربر الزامی است.",
  }),
  education: Joi.string().min(5).max(100).required().messages({
    "string.empty": "تحصیلات نباید خالی باشد.",
    "string.min": "تحصیلات باید حداقل 5 کاراکتر باشد.",
    "any.required": "تحصیلات الزامی است.",
  }),

  licenseNumber: Joi.number().integer().required().messages({
    "number.base": "شماره نظام روانشناسی باید یک عدد صحیح باشد.",
    "any.required": "شماره نظام روانشناسی الزامی است.",
  }),

  aboutMe: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "بخش درباره من نباید خالی باشد.",
    "string.min": "بخش درباره من باید حداقل ۱۰ کاراکتر باشد.",
    "any.required": "درباره من الزامی است.",
  }),

  specialization: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .required()
    .messages({
      "array.base": "تخصص‌ها باید به صورت آرایه‌ای از رشته‌ها باشند.",
      "array.min": "حداقل باید یک تخصص وارد شود.",
      "any.required": "تخصص‌ها الزامی هستند.",
    }),

  experienceYears: Joi.number().integer().min(0).required().messages({
    "number.base": "تعداد سال‌های تجربه باید یک عدد باشد.",
    "number.min": "سال تجربه نمی‌تواند منفی باشد.",
    "any.required": "تجربه الزامی است.",
  }),
});

const createReviewSchema = Joi.object({
  comment: Joi.string().min(10).max(500).required().messages({
    "string.empty": "متن کامنت نباید خالی باشد.",
    "string.min": "کامنت باید حداقل ۱۰ کاراکتر باشد.",
    "string.max": "کامنت نمی‌تواند بیش از ۵۰۰ کاراکتر باشد.",
    "any.required": "متن کامنت الزامی است.",
  }),

  stars: Joi.number().min(1).max(5).required().messages({
    "number.base": "امتیاز باید به صورت عددی بین ۱ تا ۵ باشد.",
    "number.min": "حداقل امتیاز ۱ است.",
    "number.max": "حداکثر امتیاز ۵ است.",
    "any.required": "دادن امتیاز الزامی است.",
  }),
});

module.exports = { psychologistSchema, createReviewSchema };
