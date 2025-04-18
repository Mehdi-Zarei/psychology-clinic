const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    psychologistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["reserved", "canceled", "done"],
      default: "reserved",
    },
  },
  { timestamps: true }
);

const booking = mongoose.model("booking", bookingSchema);

module.exports = booking;
