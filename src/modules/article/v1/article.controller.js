const { nanoid } = require("nanoid");
const slugify = require("slugify");
const { isValidObjectId } = require("mongoose");

const {
  errorResponse,
  successResponse,
} = require("../../../helper/responseMessage");

const articleModel = require("../../../model/Article");
const article = require("../../../model/Article");

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
      publishNow,
    } = req.body;

    const user = req.user;

    const isArticleExist = await articleModel.findOne({ title }).lean();

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
      isPublished: publishNow,
      seoTitle,
      seoDescription,
    });

    return successResponse(res, 201, "مقاله با موفقیت منتشر گردید.");
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const article = await articleModel
      .findOne({ slug, isPublished: true })
      .populate("author", "name")
      .lean();

    if (!article) {
      return errorResponse(res, 404, "مقاله ای  با این اسلاگ پیدا نشد.");
    }

    return successResponse(res, 200, article);
  } catch (error) {
    next(error);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;

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
      publishNow,
    } = req.body;

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const mainArticle = await articleModel.findOne({
      _id: id,
      author: user._id,
    });

    if (!mainArticle) {
      return errorResponse(res, 404, "مقاله ای جهت وبرایش پیدا نشد.");
    }

    mainArticle.title = title || mainArticle.title;
    mainArticle.content = content || mainArticle.content;
    mainArticle.slug = slug || mainArticle.slug;
    mainArticle.summery = summery || mainArticle.summery;
    mainArticle.readingTime = readingTime || mainArticle.readingTime;
    mainArticle.seoTitle = seoTitle || mainArticle.seoTitle;
    mainArticle.seoDescription = seoDescription || mainArticle.seoDescription;
    mainArticle.isPublished = publishNow || mainArticle.isPublished;

    if (tags) {
      Array.isArray(tags)
        ? (mainArticle.tags = [...mainArticle.tags, ...tags])
        : (mainArticle.tags = [...mainArticle.tags, tags]);
    }

    if (category) {
      Array.isArray(category)
        ? (mainArticle.category = [...mainArticle.category, ...category])
        : (mainArticle.category = [...mainArticle.category, category]);
    }

    if (req.files) {
      let images = req.files.map(
        (images) => `public/images/articles/${images.filename}`
      );

      mainArticle.images = [...mainArticle.images, ...images];
    }

    await mainArticle.save();

    return successResponse(res, 200, "مقاله با موفقیت ویرایش شد.");
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
