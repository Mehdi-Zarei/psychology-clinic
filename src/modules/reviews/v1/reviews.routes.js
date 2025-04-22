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
  createArticleReview,
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

router.route("/articles/:id").post(authGuard(), createArticleReview);

router
  .route("/articles/:id/accept")
  .patch(authGuard(["ADMIN"]), acceptArticleReview);

router
  .route("/articles/:id/remove")
  .delete(authGuard(["ADMIN"]), removeArticleReview);

module.exports = router;
