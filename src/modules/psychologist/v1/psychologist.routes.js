const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controllers
const {
  register,
  getAll,
  getOne,
  remove,
  getReviews,
  createReview,
  acceptReview,
  removeReview,
} = require("./psychologist.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/images/profile", 500, [".jpg", ".jpeg"]);

//* Validator
const { bodyValidator } = require("../../../middlewares/validator");
const {
  psychologistSchema,
  createReviewSchema,
} = require("./psychologist.validator");

//* Routes

router
  .route("/")
  .post(
    authGuard(["ADMIN"]),
    upload.single("avatar"),
    bodyValidator(psychologistSchema),
    register
  )
  .get(getAll);

router
  .route("/:id")
  .get(getOne)
  .delete(authGuard(["ADMIN"]), remove);

router
  .route("/:id/reviews")
  .get(getReviews)
  .post(authGuard(), bodyValidator(createReviewSchema), createReview);

router.route("/review/:id/accept").patch(authGuard(["ADMIN"]), acceptReview);

router.route("/review/:id/remove").delete(authGuard(["ADMIN"]), removeReview);

module.exports = router;
