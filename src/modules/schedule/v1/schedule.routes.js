const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const {
  setAvailableTime,
  getAvailableTime,
  editAppointmentDate,
  editAppointmentTime,
  removeAppointmentDate,
} = require("./schedule.controller");

//* Routes

router
  .route("/")
  .post(authGuard("PSYCHOLOGIST"), setAvailableTime)
  .get(authGuard("PSYCHOLOGIST"), getAvailableTime);

router
  .route("/:id")
  .put(authGuard("PSYCHOLOGIST"), editAppointmentDate)
  .patch(authGuard("PSYCHOLOGIST"), editAppointmentTime)
  .delete(authGuard("PSYCHOLOGIST"), removeAppointmentDate);

module.exports = router;
