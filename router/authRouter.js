import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import ApiLimiter from "../utils/ApiLimiter.js";

const router = express.Router();

router.use(ApiLimiter);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

export default router;
