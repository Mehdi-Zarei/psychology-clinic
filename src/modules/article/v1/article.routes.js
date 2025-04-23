const express = require("express");
const router = express.Router();

//* Middlewares
const authGuard = require("../../../middlewares/authGuard");

//* Controller
const {
  getAll,
  create,
  getOne,
  edit,
  remove,
  changePublishStatus,
  toggleLikeArticles,
} = require("./article.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/images/articles", 15, [".jpg", ".jpeg"]);

//* Validator
const { bodyValidator } = require("../../../middlewares/validator");
const {
  createArticleSchema,
  editArticleSchema,
} = require("./article.validator");

//* Routes

router
  .route("/")
  .get(getAll)
  .post(
    authGuard("ADMIN"),
    upload.array("images", 10),
    bodyValidator(createArticleSchema),
    create
  );

router.route("/:slug").get(getOne);

router
  .route("/:id")
  .patch(
    authGuard("ADMIN"),
    upload.array("images", 10),
    bodyValidator(editArticleSchema),
    edit
  )
  .delete(authGuard("ADMIN"), remove)
  .put(authGuard("ADMIN"), changePublishStatus);

router.route("/:id/like").post(authGuard(), toggleLikeArticles);

module.exports = router;
