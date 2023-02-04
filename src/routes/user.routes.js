import express from "express";
import {
  auth,
  login,
  logout,
  register,
} from "../controller/user.controller.js";
// import isAuthMiddleware from "../middleware/isAuthMiddleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth", auth);
router.post("/logout", logout);

export default router;
