import ResponseHandler from "./ResponseHandler.js";

const ErrorHandler = (err, req, res, next) => {
  console.error(err);
  return ResponseHandler.error(
    res,
    err.message || "Internal Server Error",
    err.status || 500
  );
};

export default ErrorHandler;
