import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат по чты").isEmail(),
  body("password", "Пароль должен быть максимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

export const PostCreateValidation = [
  body("title", "введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "неверный формат тегов").optional().isString(),
  body("ImageUrl", "неверная сслыка на изображение").optional().isString(),
];

export const CommentCreateValidation = [
  body("text", "введите текст статьи").isLength({ min: 10 }).isString(),
];
