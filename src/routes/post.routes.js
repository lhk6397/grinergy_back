import express from "express";
import {
  deletePost,
  downloadFile,
  getPost,
  getPosts,
  searchPostByTitle,
  updatePost,
  uploadFiles,
  uploadPost,
} from "../controller/post.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.route("/").get(getPosts).post(uploadPost);
router.route("/search").get(searchPostByTitle);
router.post("/uploadFiles", upload.array("file"), uploadFiles);
router.post("/downloadFile", downloadFile);
router.route("/:postId").get(getPost).post(updatePost).delete(deletePost);

export default router;
