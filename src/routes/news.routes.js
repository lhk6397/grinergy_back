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
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router.route("/").get(catchAsync(getNewss)).post(catchAsync(uploadNews));
router.route("/search").get(catchAsync(searchNewsByTitle));
router.post("/uploadImage", upload.single("file"), catchAsync(uploadImage));
router
  .route("/:newsId")
  .get(catchAsync(getNews))
  .post(catchAsync(updateNews))
  .delete(catchAsync(deleteNews));

export default router;
