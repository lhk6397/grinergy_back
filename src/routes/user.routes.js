import express from "express";
import {
  auth,
  login,
  logout,
  register,
} from "../controller/user.controller.js";
import catchAsync from "../libs/catchAsync.js";
import { isLoggedIn, isNotLoggedIn } from "../middleware/auth.middleware.js";
import Validator from "../middleware/validator.middleware.js";

const router = express.Router();

router.post(
  "/register",
  isNotLoggedIn,
  Validator("loginSchema"),
  catchAsync(register)
);
router.post(
  "/login",
  isNotLoggedIn,
  Validator("loginSchema"),
  catchAsync(login)
);
router.get("/auth", isLoggedIn, auth);
router.post("/logout", isLoggedIn, catchAsync(logout));

export default router;
