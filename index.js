import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from "cors";
import {
  PostController,
  UserController,
  CommentController,
} from "./controllers/index.js";

import {
  registerValidation,
  loginValidation,
  PostCreateValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://admin:qwerty123@cluster0.kxp6pn3.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("db ok"))
  .catch((err) => console.log("db error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/posts/:id", PostController.getOne);
app.get("/posts", PostController.getAll);
app.get("/tags/:id", PostController.getTag);
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.post(
  "/posts",
  checkAuth,
  PostCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.patch(
  "/posts/:id",
  checkAuth,
  PostCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.patch(
  "/posts/:id",
  checkAuth,
  PostCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.post("/comments/:id", checkAuth, CommentController.createComment);
app.get("/comments/:id", CommentController.getComments);
app.get("/comments", CommentController.getLastComments);
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
