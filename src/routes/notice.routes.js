import express from "express";
import {
  deleteNotice,
  downloadFile,
  getNotice,
  getNotices,
  searchNoticeByTitle,
  updateNotice,
  uploadFiles,
  uploadNotice,
} from "../controller/notice.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.route("/").get(getNotices).post(uploadNotice);
router.route("/search").get(searchNoticeByTitle);
router.post("/uploadFiles", upload.array("file"), uploadFiles);
router.post("/downloadFile", downloadFile);
router
  .route("/:noticeId")
  .get(getNotice)
  .post(updateNotice)
  .delete(deleteNotice);

export default router;
