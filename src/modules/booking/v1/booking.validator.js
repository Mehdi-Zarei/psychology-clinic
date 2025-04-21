const Joi = require("joi");

const bookingAppointmentSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "آیدی باید به صورت رشته باشد.",
    "string.length": "آیدی باید دقیقاً ۲۴ کاراکتر باشد.",
    "string.hex": "آیدی فقط باید شامل حروف و اعداد هگزادسیمال باشد.",
    "any.required": "آیدی الزامی است.",
  }),
});

const cancelBookingSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "آیدی باید به صورت رشته باشد.",
    "string.length": "آیدی باید دقیقاً ۲۴ کاراکتر باشد.",
    "string.hex": "آیدی فقط باید شامل حروف و اعداد هگزادسیمال باشد.",
    "any.required": "آیدی الزامی است.",
  }),
});

module.exports = { bookingAppointmentSchema, cancelBookingSchema };
