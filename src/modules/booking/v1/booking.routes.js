const express = require("express");
const router = express.Router();
//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const {
  getAll,
  bookingAppointment,
  cancelBooking,
  getReviews,
} = require("./booking.controller");

router.route("/").get(authGuard(), getAll);

router.route("/:id").post(authGuard(), bookingAppointment);

router.route("/:id/cancel").patch(authGuard(), cancelBooking);

router.route("/reviews").get(authGuard(), getReviews);

module.exports = router;
