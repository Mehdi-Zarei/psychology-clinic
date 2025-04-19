const express = require("express");
const router = express.Router();
//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const {
  bookingAppointment,
  getAll,
  getReviews,
} = require("./booking.controller");

router
  .route("/")
  .post(authGuard(), bookingAppointment)
  .get(authGuard(), getAll);

router.route("/reviews").get(authGuard(), getReviews);

module.exports = router;
