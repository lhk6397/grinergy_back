import Post from "../models/Post.js";
import path from "path";
import fs from "fs";

export const getPosts = async (req, res) => {
  try {
    const {
      query: { page },
    } = req;
    if (!page) throw error;
    const pageSize = 10;
    const skipPage = (page - 1) * pageSize;
    const total = await Post.count({});
    const posts = await Post.find({})
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip(skipPage);
    if (!posts) {
      return res.json({ ok: false });
    }
    return res.json({
      ok: true,
      posts,
      total,
    });
  } catch (error) {
    return res.json({
      ok: false,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ ok: false });
    }
    return res.json({
      ok: true,
      post,
    });
  } catch (error) {
    return res.json({
      ok: false,
    });
  }
};

export const uploadFiles = async (req, res) => {
  if (!req.files.length) return false;
  try {
    const fdata = [];
    req.files.map((file) =>
      fdata.push({
        filePath: file.path,
        fileName: file.filename,
        fileOriginalName: file.originalname,
      })
    );
    return res.json({ ok: true, fdata });
  } catch (err) {
    console.log("UploadFiles Err", err);
  }
};

export const downloadFile = async (req, res) => {
  const { filePath } = req.body;
  res.download(filePath);
};

export const uploadPost = async (req, res) => {
  const { title, contents, files } = req.body;
  try {
    const post = await Post.create({
      title,
      contents,
      files,
    });
    return res.status(200).json({
      ok: true,
      post,
    });
  } catch (error) {
    return res.json({
      ok: false,
    });
  }
};

export const updatePost = async (req, res) => {
  const { title, contents, file } = req.body;
  try {
    const post = await Post.findOneAndUpdate({
      title,
      contents,
      file,
    });
    return res.status(200).json({
      ok: true,
      post,
    });
  } catch (error) {
    return res.json({
      ok: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(400).send(err);
  }
};
