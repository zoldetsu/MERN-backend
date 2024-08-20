import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "не удалось получить статьи",
    });
  }
};

export const getTag = async (req, res) => {
  try {
    const tagId = req.params.id;

    console.log(tagId);

    const tagPosts = await PostModel.find().populate("user").exec();

    const tags = tagPosts.filter((p) => p.tags.includes(tagId));
    res.json(tags);
  } catch (err) {
    return res.status(500).json({
      messages: "не удалось получить тег",
    });
  }
};
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    res.status(500).json({
      message: "не удалось получить теги",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);

    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "After" }
    )
      .populate("user")
      .then((doc) => res.json(doc))
      .catch((err) => res.status(500).json({ message: "Статья не найдена" }));
  } catch (err) {
    console.log(err); // Важно для отладки
    return res.status(500).json({
      messages: "не удалось получить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      ImageUrl: req.body.ImageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
      Comments: req.Comments,
    });
    console.log(req.body);
    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "ошибка создания статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findOneAndDelete({ _id: postId });

    if (!deletedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось удалить статью" });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        ImageUrl: req.body.ImageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
        Comments: req.Comments,
      }
    );

    res.json({
      seccess: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
