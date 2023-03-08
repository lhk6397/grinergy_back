import fs from "fs";
import News from "../models/News.js";
const pageSize = 10;

export const getNewss = async (req, res) => {
  try {
    const { page } = req.query;
    const skipPage = (page - 1) * pageSize;
    if (!page) throw error;

    const total = await News.count({});
    const posts = await News.find({})
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

export const getNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const post = await News.findById(newsId);
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

export const uploadImage = async (req, res) => {
  if (!req.file) return false;
  try {
    const image = {
      filePath: req.file.path,
      fileName: req.file.filename,
      //   fileOriginalName: req.file.originalname,
    };
    return res.json({ ok: true, image });
  } catch (err) {
    console.log("UploadFiles Err", err);
  }
};

export const uploadNews = async (req, res) => {
  const { title, contents, previewImg } = req.body;
  try {
    const post = await News.create({
      title,
      contents,
      previewImg,
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

export const updateNews = async (req, res) => {
  const {
    body: { title, contents, previewImg, deleteFiles },
    params: { newsId },
  } = req;
  try {
    const post = await News.findOneAndUpdate(
      { _id: newsId },
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

export const deleteNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const post = await News.findByIdAndDelete(newsId);
    fs.unlink(post.previewImg.filePath, (err) => {
      if (err) throw err;
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.json({
      ok: false,
    });
  }
};

export const searchNewsByTitle = async (req, res) => {
  try {
    const { keyword, page } = req.query;
    if (!page) throw error;
    const skipPage = (page - 1) * pageSize;
    const option = {
      title: { $regex: keyword, $options: "i" },
    };
    const total = await News.count(option);
    const posts = await News.find(option)
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
