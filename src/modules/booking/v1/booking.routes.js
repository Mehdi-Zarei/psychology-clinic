const express = require("express");
const router = express.Router();
//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const { booking } = require("./booking.controller");

router.route("/").post(authGuard, booking);

module.exports = router;
