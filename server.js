import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
