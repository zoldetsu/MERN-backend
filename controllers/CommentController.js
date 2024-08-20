import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.body.postId;
    console.log("id --", postId);
    const comment = req.body.comment;
    if (!comment)
      return res.json({ message: "Комментарий не может быть пустым" });

    const newComment = new CommentModel({ comment, author: req.userId });
    await newComment.save();

    try {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.log(error);
    }

    res.json(newComment);
  } catch {}
};

export const getComments = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return CommentModel.findById(comment).populate("author");
      })
    );

    res.json(list);
  } catch (err) {
    console.log("ошибочка получается");
  }
};

export const getLastComments = async (req, res) => {
  try {
    const Comments = await CommentModel.find()
      .limit(5)
      .populate("author")
      .exec();

    console.log(Comments);
    res.json(Comments);
  } catch (err) {
    res.status(500).json({
      message: "не удалось получить теги",
    });
  }
};
