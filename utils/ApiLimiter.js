import rateLimit from "express-rate-limit";

const ApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});

export default ApiLimiter;
