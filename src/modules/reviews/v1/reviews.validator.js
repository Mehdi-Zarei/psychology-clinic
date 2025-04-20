const Joi = require("joi");

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

module.exports = { createReviewSchema };
