const { isValidObjectId } = require("mongoose");

const {
  successResponse,
  errorResponse,
} = require("../../../helper/responseMessage");

const psychologistModel = require("../../../model/Psychologist");
const articleModel = require("../../../model/Article");

exports.getUserReviews = async (req, res, next) => {
  try {
    const user = req.user;

    const filter =
      user.role === "ADMIN"
        ? {}
        : {
            reviews: { $elemMatch: { user: user._id } },
          };

    const allReviews = await psychologistModel
      .find(filter)
      .populate("reviews.user", "name")
      .populate("psychologistID", "name")
      .select("avatar rating reviews");

    if (!allReviews.length) {
      return errorResponse(res, 400, "شما تاکنون نظری ثبت نکرده اید.");
    }

    return successResponse(res, 200, allReviews);
  } catch (error) {
    next(error);
  }
};

exports.getPsychologistReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const psychologist = await psychologistModel
      .findOne({
        _id: id,
      })
      .populate("reviews.user", "name")
      .select("reviews");

    if (!psychologist) {
      return errorResponse(res, 404, "متاسفانه روانشناسی یافت نشد.");
    }

    const acceptedReviews = (psychologist.reviews = psychologist.reviews.filter(
      (review) => review.isAccept === true
    ));

    if (!acceptedReviews.length) {
      return errorResponse(
        res,
        404,
        "برای این روانشناس هنوز نظری ثبت نشده!شما اولین نفری باشید که نظر میدهید."
      );
    }

    return successResponse(res, 200, psychologist);
  } catch (error) {
    next(error);
  }
};

exports.createPsychologistsReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, stars } = req.body;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const psychologist = await psychologistModel.findOne({
      _id: id,
    });

    if (!psychologist) {
      return errorResponse(res, 404, "متاسفانه روانشناس مورد نظر پیدا نشد!");
    }

    psychologist.reviews.push({
      user: user._id,
      comment,
      stars,
      isAccept: false,
    });

    await psychologist.save();

    return successResponse(
      res,
      201,
      "نظر شما با موفقیت ثبت شد و پس از تائید مدیر قابل نمایش می باشد."
    );
  } catch (error) {
    next(error);
  }
};

exports.acceptPsychologistsReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const acceptReview = await psychologistModel.findOneAndUpdate(
      {
        reviews: { $elemMatch: { _id: id, isAccept: false } },
      },
      { $set: { "reviews.$.isAccept": true } }
    );

    if (!acceptReview) {
      return errorResponse(
        res,
        404,
        "این نظر قبلا تائید شده است یا وجود ندارد."
      );
    }

    const totalStars = acceptReview.reviews.reduce(
      (sum, review) => sum + review.stars,
      0
    );

    const averageRating = totalStars / acceptReview.reviews.length.toFixed(1);

    acceptReview.rating = averageRating;

    await acceptReview.save();

    return successResponse(res, 200, "کامنت مورد نظر با موفقیت تائید شد.");
  } catch (error) {
    next(error);
  }
};

exports.removePsychologistsReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const review = await psychologistModel.updateOne(
      {
        "reviews._id": id,
      },
      { $pull: { reviews: { _id: id } } }
    );

    if (!review.modifiedCount) {
      return errorResponse(res, 404, "کامنت پیدا نشد.");
    }

    return successResponse(res, 200, "کامنت مورد نظر با موفقیت پاک شد.");
  } catch (error) {
    next(error);
  }
};

exports.createArticleReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, stars } = req.body;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const addReview = await articleModel.findByIdAndUpdate(id, {
      $push: { reviews: { user: user._id, comment, stars, isAccept: false } },
    });

    if (!addReview) {
      return errorResponse(res, 404, "مقاله یافت نشد.");
    }

    return successResponse(
      res,
      201,
      "نظر شما با موفقیت ثبت شد و پس از تائید مدیر بصورت عمومی نمایش داده خواهد شد."
    );
  } catch (error) {
    next(error);
  }
};

exports.acceptArticleReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const accept = await articleModel.findOneAndUpdate(
      {
        reviews: { $elemMatch: { _id: id, isAccept: false } },
      },
      { "reviews.$.isAccept": true }
    );

    if (!accept) {
      return errorResponse(res, 404, "این نظر قبلا تائید و یا حذف شده است.");
    }

    return successResponse(res, 200, "عملیات با موفقیت انجام شد.");
  } catch (error) {
    next(error);
  }
};

exports.removeArticleReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده معتبر نمی باشد.");
    }

    const remove = await articleModel.updateOne(
      {
        "reviews._id": id,
      },
      { $pull: { reviews: { _id: id } } }
    );

    if (!remove.modifiedCount) {
      return errorResponse(res, 404, "این نظر قبلا حذف شده است.");
    }

    return successResponse(res, 200, "عملیات با موفقیت انجام شد.");
  } catch (error) {
    next(error);
  }
};
