import mongoose from "mongoose";
import connect from "../db.js";
import Post from "../models/Post.js";

const seedDB = async () => {
  await connect();
  await Post.deleteMany({});
  for (let i = 0; i < 50; i++) {
    await Post.create({
      title: i.toString(),
      contents: i.toString(),
      file: [],
    });
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
