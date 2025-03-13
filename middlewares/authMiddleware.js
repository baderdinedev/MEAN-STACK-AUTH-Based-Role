import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ResponseHandler from "../utils/ResponseHandler.js";
import User from "../models/User.js";

dotenv.config();

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return ResponseHandler.unauthorized(res, "No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return ResponseHandler.unauthorized(res, "Invalid token");
    }

    next();
  } catch (error) {
    return ResponseHandler.error(res, "Invalid or expired token", 401);
  }
};

export default AuthMiddleware;
