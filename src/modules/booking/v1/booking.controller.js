const { isValidObjectId } = require("mongoose");
const { errorResponse } = require("../../../helper/responseMessage");
const bookingModel = require("../../../model/Booking");
const scheduleModel = require("../../../model/Schedule");

exports.booking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const today = new Date();
    const times = await scheduleModel.find({
      psychologistID: id,
      date: { $gte: today },
      "availableTimes.isBooked": false,
    });

    return res.json(times);
  } catch (error) {
    next(error);
  }
};
