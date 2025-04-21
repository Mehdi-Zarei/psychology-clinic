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

//* Validator
const { bodyValidator } = require("../../../middlewares/validator");
const {
  bookingAppointmentSchema,
  cancelBookingSchema,
} = require("./booking.validator");

//* Routes
router.route("/").get(authGuard(), getAll);

router
  .route("/:id")
  .post(
    authGuard(),
    bodyValidator(bookingAppointmentSchema),
    bookingAppointment
  );

router
  .route("/:id/cancel")
  .patch(authGuard(), bodyValidator(cancelBookingSchema), cancelBooking);

module.exports = router;
