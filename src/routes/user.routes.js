import express from "express";
import {
  auth,
  login,
  logout,
  register,
} from "../controller/user.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth", auth);
router.post("/logout", logout);

export default router;
