const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controller
const {
  getUserReviews,
  getPsychologistReviews,
  createReview,
  acceptReview,
  removeReview,
} = require("./reviews.controller");

//* validator
const { bodyValidator } = require("../../../middlewares/validator");
const { createReviewSchema } = require("./reviews.validator");

//* Routes
router
  .route("/")
  .get(authGuard(), getUserReviews)
  .post(authGuard(), bodyValidator(createReviewSchema), createReview);

router.route("/psychologists/:id").get(getPsychologistReviews);

router.route("/:id/accept").patch(authGuard(["ADMIN"]), acceptReview);

router.route("/:id/remove").delete(authGuard(["ADMIN"]), removeReview);

module.exports = router;
