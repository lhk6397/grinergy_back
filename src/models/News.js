import mongoose from "mongoose";
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  filePath: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

const newsSchema = new Schema(
  {
    previewImg: fileSchema,
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);
