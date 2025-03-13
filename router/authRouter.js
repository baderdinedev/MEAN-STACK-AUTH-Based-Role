import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import ApiLimiter from "../utils/ApiLimiter.js";

const router = express.Router();

router.use(ApiLimiter);

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
