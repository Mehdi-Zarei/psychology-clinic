const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controller
const {
  getUserReviews,
  getPsychologistReviews,
  createReview,
  acceptPsychologistsReview,
  removePsychologistsReview,
  acceptArticleReview,
  removeArticleReview,
} = require("./reviews.controller");

//* validator
const { bodyValidator } = require("../../../middlewares/validator");
const { createReviewSchema } = require("./reviews.validator");

//* Routes
router.route("/").get(authGuard(), getUserReviews);

router
  .route("/psychologists/:id")
  .get(getPsychologistReviews)
  .post(authGuard(), bodyValidator(createReviewSchema), createReview);

router
  .route("/psychologists/:id/accept")
  .patch(authGuard(["ADMIN"]), acceptPsychologistsReview);

router
  .route("/psychologists/:id/remove")
  .delete(authGuard(["ADMIN"]), removePsychologistsReview);

router
  .route("/articles/:id/accept")
  .post(authGuard(["ADMIN"]), acceptArticleReview)
  .delete(authGuard(["ADMIN"]), removeArticleReview);

module.exports = router;
