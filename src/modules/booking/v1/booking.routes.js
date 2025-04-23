const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const {
  getAll,
  bookingAppointment,
  cancelBooking,
} = require("./booking.controller");

//* Routes
router.route("/").get(authGuard(), getAll);

router.route("/:id").post(authGuard(), bookingAppointment);

router.route("/:id/cancel").patch(authGuard(), cancelBooking);

module.exports = router;
