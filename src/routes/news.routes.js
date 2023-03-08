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
const router = express.Router();

router.route("/").get(getNewss).post(uploadNews);
router.route("/search").get(searchNewsByTitle);
router.post("/uploadImage", upload.single("file"), uploadImage);
router.route("/:newsId").get(getNews).post(updateNews).delete(deleteNews);

export default router;
