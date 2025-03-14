import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseHandler from "../utils/ResponseHandler.js";

dotenv.config();

// ✅ Update Profile
export const profileUpdate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    return ResponseHandler.success(
      res,
      "Profile updated successfully",
      updatedUser
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// ✅ Update User Role (Admin Only)
export const updateUserRole = async (req, res) => {
  try {
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);

    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return ResponseHandler.error(res, "Role is required", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    return ResponseHandler.success(
      res,
      "User role updated successfully",
      updatedUser
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return ResponseHandler.error(res, "Invalid value for isBlocked", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );

    if (!updatedUser) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    const status = isBlocked ? "blocked" : "unblocked";
    return ResponseHandler.success(
      res,
      `User ${status} successfully`,
      updatedUser
    );
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return ResponseHandler.success(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }
    return ResponseHandler.success(res, "User fetched successfully", user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return ResponseHandler.error(res, "User not found", 404);
    }
    return ResponseHandler.success(res, "User deleted successfully", {});
  } catch (error) {
    console.error("Error deleting user:", error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// users can change password

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return ResponseHandler.error(res, "Old password is incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    return ResponseHandler.success(res, "Password changed successfully", {});
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// resetPassword

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send email with reset password link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    // You can implement email sending logic here

    return ResponseHandler.success(
      res,
      "Reset password link sent successfully",
      { resetLink }
    );
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// Search Users

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    return ResponseHandler.success(res, "Users fetched successfully", users);
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// List Users by Role

export const listUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
    return ResponseHandler.success(res, "Users fetched successfully", users);
  } catch (error) {
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};
