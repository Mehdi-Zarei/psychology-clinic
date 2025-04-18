const { errorResponse } = require("../helper/responseMessage");

exports.errorHandler = (err, req, res, next) => {
  console.log("🧯 Error Handler Triggered");

  const status = err.status || 500;
  const defaultMessage = "خطای داخلی سرور";

  // Joi validation error
  if (err.isJoi) {
    const validationErrors = err.details.map((detail) => ({
      field: detail.context?.key || "نامشخص",
      message: detail.message,
    }));

    console.log("📦 Joi Validation Error:", validationErrors);

    return errorResponse(
      res,
      400,
      "خطا در اعتبارسنجی اطلاعات",
      validationErrors
    );
  }

  const errorMessage =
    typeof err.message === "string" ? err.message : defaultMessage;

  console.log("🔥 Full Error Object:", err);

  return errorResponse(res, status, errorMessage);
};
