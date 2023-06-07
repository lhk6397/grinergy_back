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
import catchAsync from "../libs/catchAsync.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import Validator from "../middleware/Validator.middleware.js";
const router = express.Router();

router
  .route("/")
  .get(catchAsync(getNotices))
  .post(Validator("uploadNoticeSchema"), catchAsync(uploadNotice));
router.route("/search").get(catchAsync(searchNoticeByTitle));
router.post(
  "/uploadFiles",
  isLoggedIn,
  upload.array("file"),
  catchAsync(uploadFiles)
);
router.post("/downloadFile", downloadFile);
router
  .route("/:noticeId")
  .get(catchAsync(getNotice))
  .post(isLoggedIn, Validator("updateNoticeSchema"), catchAsync(updateNotice))
  .delete(isLoggedIn, catchAsync(deleteNotice));

export default router;
