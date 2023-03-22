import express from "express";
import {
  auth,
  login,
  logout,
  register,
} from "../controller/user.controller.js";
import catchAsync from "../utils/catchAsync.js";
const router = express.Router();

router.post("/register", catchAsync(register));
router.post("/login", catchAsync(login));
router.get("/auth", auth);
router.post("/logout", catchAsync(logout));

export default router;
