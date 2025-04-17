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

  // Yup validation error
  if (err.name === "ValidationError" && err.errors) {
    const errors = err.errors.map((msg) => ({
      message: msg,
    }));

    return errorResponse(res, 400, "خطا در اعتبارسنجی اطلاعات", errors);
  }

  // Zod validation error
  if (err.name === "ZodError" && err.issues) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return errorResponse(res, 400, "خطا در اعتبارسنجی اطلاعات", errors);
  }

  const errorMessage =
    typeof err.message === "string" ? err.message : defaultMessage;

  console.log("🔥 Full Error Object:", err);

  return errorResponse(res, status, errorMessage);
};
