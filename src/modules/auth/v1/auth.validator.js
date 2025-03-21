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

module.exports = { sentOtpSchema };
