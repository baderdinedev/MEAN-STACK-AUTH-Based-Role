import express from "express";
import {
  profileUpdate,
  updateUserRole,
  blockUser,
  getAllUsers,
  getUserById,
  deleteUser,
  changePassword,
  searchUsers,
  listUsersByRole,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import ApiLimiter from "../utils/ApiLimiter.js";

const router = express.Router();

router.use(ApiLimiter);

router.put("/profile/:id", authMiddleware, profileUpdate);
router.put(
  "/role/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUserRole
);
router.put("/block/:id", authMiddleware, roleMiddleware(["admin"]), blockUser);
router.get("/search", authMiddleware, roleMiddleware(["admin"]), searchUsers);
router.get(
  "/role/:role",
  authMiddleware,
  roleMiddleware(["admin"]),
  listUsersByRole
);

router.put("/change-password", authMiddleware, changePassword);
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

export default router;
