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
} = require("./psychologist.controller");

//* Uploader
const { multerStorage } = require("../../../utils/multer");
const upload = multerStorage("public/images/profile", 500, [".jpg", ".jpeg"]);

//* Routes

router
  .route("/")
  .post(authGuard(["ADMIN"]), upload.single("avatar"), register) //todo body validator
  .get(getAll);

router
  .route("/:id")
  .get(getOne)
  .delete(authGuard(["ADMIN"]), remove);

module.exports = router;
