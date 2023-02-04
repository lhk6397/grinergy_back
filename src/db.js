import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🚀 Connected to DB");
  } catch (error) {
    console.log("❌ DB Error", error);
    process.exit(1);
  }
}

export default connect;
