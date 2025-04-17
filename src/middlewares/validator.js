const fs = require("fs");

const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(`${req.file.destination}/${req.file.filename}`);
      }
      next(error);
    }
  };
};

module.exports = { bodyValidator };
