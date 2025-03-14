import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseHandler from "../utils/ResponseHandler.js";

dotenv.config();

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseHandler.error(res, "User already exists", 400);
    }

    const user = new User({ name, email, password });
    await user.save(); // 🔹 Password gets hashed in User model

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return ResponseHandler.success(
      res,
      "User registered successfully",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
      201
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ResponseHandler.error(res, "Email and password are required", 400);
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return ResponseHandler.error(res, "User not found", 401);
    }

    if (user.isBlocked) {
      return ResponseHandler.error(
        res,
        "Your account is blocked. Please contact support.",
        403
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ResponseHandler.error(res, "Invalid credentials", 401);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return ResponseHandler.success(res, "Login successful", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return ResponseHandler.error(res, "Server error", 500, error.message);
  }
};

export const logoutUser = async (req, res) => {
  return ResponseHandler.success(res, "Logged out successfully", {});
};
