import Post from "../models/Post.js";
import fs from "fs";
const pageSize = 10;

export const getPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const skipPage = (page - 1) * pageSize;
    if (!page) throw error;

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
  const {
    body: { title, contents, files, deleteFiles },
    params: { postId },
  } = req;
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        title,
        contents,
      }
    );
    if (files) {
      post.files.push(...files);
      await post.save();
    }
    if (deleteFiles) {
      let dfs = [];
      if (Array.isArray(deleteFiles)) {
        dfs = deleteFiles;
      } else {
        dfs.push(deleteFiles);
      }
      await post.updateOne({
        $pull: { files: { fileName: { $in: dfs } } },
      });
      dfs.forEach((file) => {
        fs.unlink("uploads" + "/" + file, (err) => {
          if (err) throw err;
        });
      });
    }
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
    const post = await Post.findByIdAndDelete(postId);
    post.files.forEach((file) => {
      fs.unlink(file.filePath, (err) => {
        if (err) throw err;
      });
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.json({
      ok: false,
    });
  }
};

export const searchPostByTitle = async (req, res) => {
  try {
    const { keyword, page } = req.query;
    if (!page) throw error;
    const skipPage = (page - 1) * pageSize;
    const option = {
      title: { $regex: keyword, $options: "i" },
    };
    const total = await Post.count(option);
    const posts = await Post.find(option)
      .sort({ _id: -1 })
      .limit(pageSize)
      .skip(skipPage);
    return res.json({
      ok: true,
      posts,
      total,
    });
  } catch (err) {
    return res.json({
      ok: false,
    });
  }
};
