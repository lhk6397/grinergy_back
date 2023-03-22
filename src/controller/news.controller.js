import fs from "fs";
import News from "../models/News.js";
import ExpressError from "../utils/expressError.js";
import ExperssError from "../utils/expressError.js";
const pageSize = 10;

export const getNewss = async (req, res) => {
  const { page } = req.query;
  const skipPage = (page - 1) * pageSize;
  if (!page) throw new ExperssError("Page Not Found", 404);

  const total = await News.count({});
  const posts = await News.find({})
    .sort({ _id: -1 })
    .limit(pageSize)
    .skip(skipPage);
  if (!posts) throw new ExperssError("Page Not Found", 404);
  return res.status(200).json({
    ok: true,
    posts,
    total,
  });
};

export const getNews = async (req, res) => {
  const { newsId } = req.params;
  const post = await News.findById(newsId);
  if (!post) throw new ExpressError("게시글 정보가 없습니다.", 404);
  return res.json({
    ok: true,
    post,
  });
};

export const uploadImage = async (req, res) => {
  if (!req.file) throw new ExperssError("이미지가 존재하지 않습니다.", 422);
  const image = {
    filePath: req.file.path,
    fileName: req.file.filename,
  };
  return res.json({ ok: true, image });
};

export const uploadNews = async (req, res) => {
  const { title, url, contents, previewImg } = req.body;
  const post = await News.create({
    title,
    url,
    contents,
    previewImg,
  });
  return res.status(200).json({
    ok: true,
    post,
  });
};

export const updateNews = async (req, res) => {
  const {
    body: { title, url, contents, image },
    params: { newsId },
  } = req;
  const post = await News.findOneAndUpdate(
    { _id: newsId },
    {
      title,
      url,
      contents,
    }
  );
  if (image) {
    fs.unlink(post.previewImg.filePath, (err) => {
      if (err) throw err;
    });
    post.previewImg = image;
    await post.save();
  }
  return res.status(200).json({
    ok: true,
    post,
  });
};

export const deleteNews = async (req, res) => {
  const { newsId } = req.params;
  const post = await News.findByIdAndDelete(newsId);
  fs.unlink(post.previewImg.filePath, (err) => {
    if (err) throw err;
  });
  return res.status(200).json({ ok: true });
};

export const searchNewsByTitle = async (req, res) => {
  const { keyword, page } = req.query;
  if (!page) throw new ExpressError("검색된 결과거 없습니다.", 422);
  const skipPage = (page - 1) * pageSize;
  const option = {
    title: { $regex: keyword, $options: "i" },
  };
  const total = await News.count(option);
  const posts = await News.find(option)
    .sort({ _id: -1 })
    .limit(pageSize)
    .skip(skipPage);
  if (!posts) throw new ExpressError("검색된 결과거 없습니다.", 422);
  return res.json({
    ok: true,
    posts,
    total,
  });
};
