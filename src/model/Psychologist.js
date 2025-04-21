const mongoose = require("mongoose");

const psychologistSchema = new mongoose.Schema(
  {
    psychologistID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "",
    },
    education: {
      type: String,
      require: true,
    },
    licenseNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    aboutMe: {
      type: String,
      require: true,
    },
    specialization: {
      type: [String],
      required: true,
    },
    experienceYears: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        comment: { type: String, required: true },
        stars: { type: Number, required: true, default: 5 },
        isAccept: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { timestamps: true }
);

const psychologist = mongoose.model("psychologist", psychologistSchema);

module.exports = psychologist;
