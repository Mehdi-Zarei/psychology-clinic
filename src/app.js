const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//* Import Files
const { corsOptions } = require("./middlewares/corsOptions");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./modules/auth/v1/auth.routes");
const scheduleRoutes = require("./modules/schedule/v1/schedule.routes");
const bookingRoutes = require("./modules/booking/v1/booking.routes");
const psychologistRoutes = require("./modules/psychologist/v1/psychologist.routes");
const reviewRoutes = require("././modules/reviews/v1/reviews.routes");
const articleRoutes = require("././modules/article/v1/article.routes");

//* Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());
app.use(cors(corsOptions));

//* Import Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/book", bookingRoutes);
app.use("/api/v1/psychologist", psychologistRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/articles", articleRoutes);

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
