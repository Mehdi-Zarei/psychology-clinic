const { errorResponse } = require("../helper/responseMessage");

exports.errorHandler = (err, req, res, next) => {
  let message = err.message || "Internal Server Error";
  let status = err.status || 500;

  console.log({ success: false, err });
  return errorResponse(res, status, message);
};
