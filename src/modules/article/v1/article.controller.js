const { nanoid } = require("nanoid");
const { isValidObjectId } = require("mongoose");
const slugify = require("slugify");
const fs = require("fs");

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
      publishNow,
    } = req.body;

    const user = req.user;

    let images = [];

    if (req.files) {
      images = req.files.map(
        (images) => `public/images/articles/${images.filename}`
      );
    }

    const isArticleExist = await articleModel.findOne({ title }).lean();

    if (isArticleExist) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path, (err) => {
            console.error(`❌ خطا در حذف فایل ${path}:`, err.message);
          });
        });
      }
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
      .findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } })
      .populate("author", "name")
      .populate("reviews.user", "name")
      .lean();

    if (!article) {
      return errorResponse(res, 404, "مقاله ای  با این اسلاگ پیدا نشد.");
    }

    article.reviews = article.reviews.filter((item) => item.isAccept === true);

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

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const mainArticle = await articleModel.findOne({ _id: id });

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
      const currentTags = mainArticle.tags || [];
      const newTags = Array.isArray(tags) ? tags : [tags];
      mainArticle.tags = Array.from(new Set([...currentTags, ...newTags]));
    }

    if (category) {
      const currentCategories = mainArticle.category || [];
      const newCategories = Array.isArray(category) ? category : [category];
      mainArticle.category = Array.from(
        new Set([...currentCategories, ...newCategories])
      );
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
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const removeArticle = await articleModel.findOneAndDelete({ _id: id });

    if (!removeArticle) {
      return errorResponse(res, 200, "مقاله پیدا نشد..");
    }

    removeArticle.images.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path, (err) => {
          console.error(`❌ خطا در حذف فایل ${path}:`, err.message);
        });
      }
    });

    return successResponse(res, 200, "مقاله با موفقیت حذف گردید.");
  } catch (error) {
    next(error);
  }
};

exports.changePublishStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const changeStatus = await articleModel.findById(id);

    if (!changeStatus) {
      return errorResponse(res, 404, "مقاله یافت نشد.");
    }

    let message;

    if (changeStatus.isPublished) {
      changeStatus.isPublished = false;

      message = "وضعیت مشاهده مقاله با موفقیت به حالت غیر عمومی تغییر یافت.";
    } else {
      changeStatus.isPublished = true;

      message = "وضعیت مشاهده مقاله با موفقیت به حالت عمومی تغییر یافت.";
    }

    await changeStatus.save();
    return successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};

exports.toggleLikeArticles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 409, "آیدی وارد شده صحیح نمی باشد.");
    }

    const article = await articleModel.findById(id);

    if (!article) {
      return errorResponse(res, 404, "مقاله یافت نشد.");
    }

    const hasLike = article.likes.users.includes(user._id);

    let message = "";

    if (hasLike) {
      await articleModel.findByIdAndUpdate(id, {
        $pull: { "likes.users": user._id },
        $inc: { "likes.count": -1 },
      });
      message = "لایک مقاله برداشته شد.";
    } else {
      article.likes.count++;
      article.likes.users.push(user._id);
      message = "مقاله لایک شد.";
      await article.save();
    }

    return successResponse(res, 200, message);
  } catch (error) {
    next(error);
  }
};
