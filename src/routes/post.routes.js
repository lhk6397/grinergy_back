import express from "express";
import {
  deletePost,
  downloadFile,
  getPost,
  getPosts,
  updatePost,
  uploadFiles,
  uploadPost,
} from "../controller/post.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.route("/").get(getPosts).post(uploadPost);
router.post("/uploadFiles", upload.array("file", 5), uploadFiles);
router.post("/downloadFile", downloadFile);
router.route("/:postId").get(getPost).post(updatePost).delete(deletePost);

export default router;
