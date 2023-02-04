import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
const saltRounds = 12;

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: 1,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    requried: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

export default mongoose.model("User", userSchema);
