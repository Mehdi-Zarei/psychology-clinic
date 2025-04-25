const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    images: [{ type: String }],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
    summery: {
      type: String,
      maxLength: [200, "خلاصه نباید بیشتر از ۳۰۰ کاراکتر باشد."],
    },
    tags: [{ type: String, required: true }],
    category: [{ type: String, required: true }],
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    },
    readingTime: {
      type: Number,
      required: true,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "عنوان سئو حداکثر باید ۶۰ کاراکتر باشد."],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "توضیحات سئو حداکثر باید ۱۶۰ کاراکتر باشد."],
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

const article = mongoose.model("article", articleSchema);

module.exports = article;
