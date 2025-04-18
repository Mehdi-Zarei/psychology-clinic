const express = require("express");
const router = express.Router();
//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const { bookingAppointment } = require("./booking.controller");

router.route("/:id").post(authGuard(), bookingAppointment);

module.exports = router;
