const mongoose = require("mongoose");

const bookingTimes = new mongoose.Schema({
  time: {
    type: String,
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
    psychologist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    availableTimes: [bookingTimes],
  },
  { timestamps: true }
);

const schedule = mongoose.model("schedule", scheduleSchema);

module.exports = schedule;
