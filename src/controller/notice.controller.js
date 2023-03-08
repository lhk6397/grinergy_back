import fs from "fs";
import Notice from "../models/Notice.js";
const pageSize = 10;

export const getNotices = async (req, res) => {
  try {
    const { page } = req.query;
    const skipPage = (page - 1) * pageSize;
    if (!page) throw error;

    const total = await Notice.count({});
    const posts = await Notice.find({})
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

export const getNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const post = await Notice.findById(noticeId);
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

export const uploadNotice = async (req, res) => {
  const { title, contents, files } = req.body;
  try {
    const post = await Notice.create({
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

export const updateNotice = async (req, res) => {
  const {
    body: { title, contents, files, deleteFiles },
    params: { noticeId },
  } = req;
  try {
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

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const post = await Notice.findByIdAndDelete(noticeId);
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

export const searchNoticeByTitle = async (req, res) => {
  try {
    const { keyword, page } = req.query;
    if (!page) throw error;
    const skipPage = (page - 1) * pageSize;
    const option = {
      title: { $regex: keyword, $options: "i" },
    };
    const total = await Notice.count(option);
    const posts = await Notice.find(option)
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
