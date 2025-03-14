import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import ApiLimiter from "../utils/ApiLimiter.js";

const router = express.Router();
router.use(ApiLimiter);
router.get("/", authMiddleware, roleMiddleware(["admin"]), getCategories);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getCategoryById);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createCategory);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateCategory);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteCategory
);

router.get("/search", authMiddleware, roleMiddleware(["admin"]), getCategories);

export default router;
