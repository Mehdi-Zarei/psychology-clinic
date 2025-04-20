const mongoose = require("mongoose");

const bookingTimes = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const scheduleSchema = new mongoose.Schema(
  {
    psychologistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    availableTimes: [bookingTimes],

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const schedule = mongoose.model("schedule", scheduleSchema);

module.exports = schedule;
