const { nanoid } = require("nanoid");
const slugify = require("slugify");

const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");
const articleModel = require("../../../model/Article");

exports.getAll = async (req, res, next) => {
  try {
    const articles = await articleModel
      .find({ isPublished: true })
      .populate("author", "name")
      .lean();

    if (!articles.length) {
      return errorResponse(res, 404, "فعلا هیچ مقاله ای ثبت نشده است.");
    }

    return successResponse(res, 200, articles);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      content,
      slug,
      tags,
      summery,
      category,
      readingTime,
      seoTitle,
      seoDescription,
    } = req.body;

    const user = req.user;

    const isArticleExist = await articleModel.findOne({ title, slug }).lean();

    if (isArticleExist) {
      return errorResponse(
        res,
        409,
        "این مقاله قبلا ثبت شده و تکراری می باشد."
      );
    }

    let generateSlug = slugify(slug, { lower: true, strict: true });

    const isSlugExist = !!(await articleModel.findOne({ generateSlug }).lean());

    if (isSlugExist) {
      generateSlug = generateSlug + "-" + Date.now().toString().slice(-4);
    }

    let shortIdentifier = nanoid(6);

    const isShortIdentifierExist = !!(await articleModel
      .findOne({ shortIdentifier })
      .lean());

    if (isShortIdentifierExist) {
      shortIdentifier = shortIdentifier + "-" + Date.now().toString().slice(-2);
    }

    const generateSummery =
      summery || content.split(" ").slice(0, 50).join(" ") + "...";

    let images = [];

    if (req.files) {
      images = req.files.map(
        (images) => `public/images/articles/${images.filename}`
      );
    }

    await articleModel.create({
      title,
      content,
      author: user._id,
      slug: generateSlug,
      images,
      tags,
      summery: generateSummery,
      shortIdentifier,
      category,
      readingTime,
      isPublished: false,
      seoTitle,
      seoDescription,
    });

    return successResponse(
      res,
      201,
      "مقاله با موفقیت ثبت شد.جهت نمایش بصورت عمومی لطفا حالت نمایش را به عمومی تغییر دهید. "
    );
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
