import mongoose from "mongoose";
import PasswordHasher from "../utils/PasswordHasher.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await PasswordHasher.hashPassword(this.password);
  next();
});

// 🔹 Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await PasswordHasher.comparePassword(enteredPassword, this.password);
};

// 🔹 Remove password from returned data
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
