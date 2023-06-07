import * as bcrypt from "bcrypt";
import User from "../models/User.js";
import ExpressError from "../libs/expressError.js";

export const register = async (req, res) => {
  const { userId, password } = req.body;
  const existingUser = await User.exists({
    $or: [{ userId }],
  });

  if (existingUser) throw new ExpressError("이미 존재하는 아이디입니다.", 401);

  const user = await User.create({
    userId,
    password,
    level: 1,
  });

  req.session.user = {
    userId: user._id,
    level: user.level,
  };
  return res.json({
    ok: true,
    userId: user._id,
    level: user.level,
  });
};

export const login = async (req, res) => {
  const { userId, password } = req.body;
  const foundUser = await User.findOne({ userId });
  if (!foundUser)
    throw new ExpressError("아이디에 해당하는 유저가 없습니다.", 401);

  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) throw new ExpressError("비밀번호가 일치하지 않습니다.", 401);

  req.session.user = {
    userId: foundUser._id,
    level: foundUser.level,
  };

  req.session.save((err) => {
    if (err) throw err;
    return res.status(200).json({
      ok: true,
      userId: foundUser._id,
      level: foundUser.level,
    });
  });
};

export const auth = (req, res) => {
  const user = req.session?.user;
  if (user) {
    return res.status(200).json({
      _id: user._id,
      isAdmin: user.level === 0 ? false : true,
      isAuth: true,
      userId: user.userId,
      level: user.level,
    });
  }
  return res.json({
    ok: false,
  });
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    return res.status(200).json({ ok: true });
  });
};
