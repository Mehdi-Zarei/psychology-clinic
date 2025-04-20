const Joi = require("joi");

const setAvailableTimeSchema = Joi.object({
  date: Joi.string().isoDate().required().messages({
    "date.base": "فرمت تاریخ معتبر نیست!",
    "any.required": "تاریخ ضروری است!",
    "date.iso": "فرمت تاریخ باید مطابق با استاندارد ISO باشد!",
  }),
  availableTimes: Joi.array()
    .items(
      Joi.object({
        time: Joi.string().isoDate().required().messages({
          "string.pattern.base":
            "فرمت ساعت صحیح نیست! ساعت باید به شکل HH:mm (مثال: 01:00) باشد.",
          "any.required": "ساعت ضروری است!",
        }),

        isBooked: Joi.boolean().required().messages({
          "any.required": "وضعیت رزرو ضروری است!",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "حداقل یک تایم باید مشخص شود!",
      "any.required": "تایم‌های مشاوره ضروری هستند!",
    }),
});

const editAppointmentDateSchema = Joi.object({
  date: Joi.string().isoDate().required().messages({
    "date.base": "فرمت تاریخ معتبر نیست!",
    "any.required": "تاریخ ضروری است!",
    "date.iso": "فرمت تاریخ باید مطابق با استاندارد ISO باشد!",
  }),
});

const editAppointmentTimeSchema = Joi.object({
  newTime: Joi.object({
    time: Joi.string().isoDate().required().messages({
      "string.pattern.base": "فرمت ساعت صحیح نیست! باید به شکل HH:mm باشد.",
      "any.required": "ساعت ضروری است!",
    }),
    isBooked: Joi.boolean().required().messages({
      "any.required": "وضعیت رزرو ضروری است!",
    }),
  })
    .required()
    .messages({
      "any.required": "مقدار newTime ضروری است!",
    }),
});

module.exports = {
  setAvailableTimeSchema,
  editAppointmentDateSchema,
  editAppointmentTimeSchema,
};
