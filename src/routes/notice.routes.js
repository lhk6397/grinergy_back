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
import catchAsync from "../utils/catchAsync.js";
const router = express.Router();

router.route("/").get(catchAsync(getNotices)).post(catchAsync(uploadNotice));
router.route("/search").get(catchAsync(searchNoticeByTitle));
router.post("/uploadFiles", upload.array("file"), catchAsync(uploadFiles));
router.post("/downloadFile", downloadFile);
router
  .route("/:noticeId")
  .get(catchAsync(getNotice))
  .post(catchAsync(updateNotice))
  .delete(catchAsync(deleteNotice));

export default router;
