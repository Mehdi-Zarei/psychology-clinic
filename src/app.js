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

//* Built-in Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(cookieParser());
app.use(cors(corsOptions));

//* Import Routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/schedule", scheduleRoutes);

//* 404 Error Handler

app.use((req, res) => {
  return res.status(404).json({ message: "OoPss!Page Not Found !!" });
});

//* Global Error Handler

app.use(errorHandler);

module.exports = app;
