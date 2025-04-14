exports.booking = async (req, res, next) => {
  try {
    const {} = req.body;
  } catch (error) {
    next(error);
  }
};
