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

//* Validator
const { bodyValidator } = require("../../../middlewares/validator");
const {
  setAvailableTimeSchema,
  editAppointmentDateSchema,
  editAppointmentTimeSchema,
} = require("./schedule.validator");

//* Routes

router
  .route("/")
  .post(
    authGuard(["PSYCHOLOGIST", "ADMIN"]),
    bodyValidator(setAvailableTimeSchema),
    setAvailableTime
  )
  .get(authGuard(["ADMIN", "PSYCHOLOGIST"]), getAvailableTime);

router
  .route("/:id")
  .put(
    authGuard(["PSYCHOLOGIST"]),
    bodyValidator(editAppointmentDateSchema),
    editAppointmentDate
  )
  .patch(
    authGuard(["PSYCHOLOGIST"]),
    bodyValidator(editAppointmentTimeSchema),
    editAppointmentTime
  )
  .delete(authGuard(["PSYCHOLOGIST"]), removeAppointmentDate);

module.exports = router;
