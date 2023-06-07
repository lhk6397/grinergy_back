import fs from "fs";
import Notice from "../models/Notice.js";
import ExpressError from "../libs/expressError.js";
const pageSize = 10;

export const getNotices = async (req, res) => {
  const { page } = req.query;
  const skipPage = (page - 1) * pageSize;
  if (!page) throw new ExpressError("Page Not Found", 404);

  const total = await Notice.count({});
  const posts = await Notice.find({})
    .sort({ _id: -1 })
    .limit(pageSize)
    .skip(skipPage);
  if (!posts) throw new ExpressError("Page Not Found", 404);
  return res.status(200).json({
    ok: true,
    posts,
    total,
  });
};

export const getNotice = async (req, res) => {
  const { noticeId } = req.params;
  const post = await Notice.findById(noticeId);
  if (!post) throw new ExpressError("게시글 정보가 없습니다.", 404);
  return res.status(200).json({
    ok: true,
    post,
  });
};

export const uploadFiles = async (req, res) => {
  if (!req.files.length) throw new ExpressError("선택된 파일이 없습니다.", 422);
  const fdata = [];
  req.files.map((file) =>
    fdata.push({
      filePath: file.path,
      fileName: file.filename,
      fileOriginalName: file.originalname,
    })
  );
  return res.status(201).json({ ok: true, fdata });
};

export const downloadFile = async (req, res) => {
  const { filePath } = req.body;
  return res.download(filePath);
};

export const uploadNotice = async (req, res) => {
  const { title, contents, files } = req.body;
  const post = await Notice.create({
    title,
    contents,
    files,
  });
  return res.status(200).json({
    ok: true,
    post,
  });
};

export const updateNotice = async (req, res) => {
  const {
    body: { title, contents, files, deleteFiles },
    params: { noticeId },
  } = req;
  const post = await Notice.findOneAndUpdate(
    { _id: noticeId },
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
  return res.status(201).json({
    ok: true,
    post,
  });
};

export const deleteNotice = async (req, res) => {
  const { noticeId } = req.params;
  const post = await Notice.findByIdAndDelete(noticeId);
  post.files.forEach((file) => {
    fs.unlink(file.filePath, (err) => {
      if (err) throw err;
    });
  });
  return res.status(201).json({ ok: true });
};

export const searchNoticeByTitle = async (req, res) => {
  const { keyword, page } = req.query;
  if (!page) throw new ExpressError("검색된 결과가 없습니다", 422);
  const skipPage = (page - 1) * pageSize;
  const option = {
    title: { $regex: keyword, $options: "i" },
  };
  const total = await Notice.count(option);
  const posts = await Notice.find(option)
    .sort({ _id: -1 })
    .limit(pageSize)
    .skip(skipPage);
  if (!posts) throw new ExpressError("검색된 결과가 없습니다", 422);
  return res.status(200).json({
    ok: true,
    posts,
    total,
  });
};
