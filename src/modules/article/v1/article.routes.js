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
} = require("./article.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/images/articles", 15, [".jpg", ".jpeg"]);

//* Routes

router
  .route("/")
  .get(getAll)
  .post(authGuard("ADMIN"), upload.array("images", 10), create);

router.route("/:slug").get(getOne);

router
  .route("/:id")
  .patch(authGuard("ADMIN"), upload.array("images", 10), edit)
  .delete(authGuard("ADMIN"), remove)
  .put(authGuard("ADMIN"), changePublishStatus);

module.exports = router;
