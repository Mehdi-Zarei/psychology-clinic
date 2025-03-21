const bodyValidator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      return res.status(400).json({ errors: err.message });
    }
  };
};

module.exports = { bodyValidator };
