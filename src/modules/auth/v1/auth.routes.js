const express = require("express");
const router = express.Router();

//* Controller
const {
  sentOtp,
  verify,
  register,
  login,
  loginWithOtp,
  logout,
  refreshAccessToken,
  gtMe,
} = require("./auth.controller");

//* Routes

router.route("/sent").post(sentOtp);

router.route("/verify").post(verify);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/login-otp").post(loginWithOtp);

router.route("/logout").post(logout);

router.route("/refresh").get(refreshAccessToken);

router.route("/me").get(gtMe);

module.exports = router;
