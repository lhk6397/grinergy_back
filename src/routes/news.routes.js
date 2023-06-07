import express from "express";
import {
  deleteNews,
  getNews,
  getNewss,
  searchNewsByTitle,
  updateNews,
  uploadImage,
  uploadNews,
} from "../controller/news.controller.js";
import upload from "../middleware/multer.js";
import catchAsync from "../libs/catchAsync.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import Validator from "../middleware/Validator.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(catchAsync(getNewss))
  .post(isLoggedIn, Validator("uploadNewsSchema"), catchAsync(uploadNews));
router.route("/search").get(catchAsync(searchNewsByTitle));
router.post(
  "/uploadImage",
  upload.single("file"),
  isLoggedIn,
  catchAsync(uploadImage)
);
router
  .route("/:newsId")
  .get(catchAsync(getNews))
  .post(isLoggedIn, Validator("updateNewsSchema"), catchAsync(updateNews))
  .delete(isLoggedIn, catchAsync(deleteNews));

export default router;
