const express = require("express");
const router = express.Router();

//* Controller
const {
  sentOtp,
  verify,
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  updateProfile,
} = require("./auth.controller");

//* Validator
const { bodyValidator } = require("../../../middlewares/validator");
const {
  sentOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
} = require("./auth.validator");
const authGuard = require("../../../middlewares/authGuard");

//* Uploader
const { multerStorage } = require("../../../utils/multer");

const upload = multerStorage("public/images/profile", 5, [".jpg", ".jpeg"]);

//* Routes

router.route("/sent").post(bodyValidator(sentOtpSchema), sentOtp);

router.route("/verify").post(bodyValidator(verifyOtpSchema), verify);

router.route("/register").post(bodyValidator(registerSchema), register);

router.route("/login").post(bodyValidator(loginSchema), login);

router.route("/logout").post(authGuard(), logout);

router.route("/refresh").get(authGuard(), refreshAccessToken);

router
  .route("/me")
  .get(authGuard(), getMe)
  .patch(authGuard(), upload.single("avatar"), updateProfile); //todo body validator for update profile

module.exports = router;
