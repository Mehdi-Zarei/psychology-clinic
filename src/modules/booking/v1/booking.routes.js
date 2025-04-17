const express = require("express");
const router = express.Router();
//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const { booking } = require("./booking.controller");

router.route("/:id").post(authGuard(), booking);

module.exports = router;
