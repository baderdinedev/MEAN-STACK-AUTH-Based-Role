import ResponseHandler from "../utils/ResponseHandler.js";

const RoleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return ResponseHandler.unauthorized(res, "Access denied");
    }
    next();
  };
};

export default RoleMiddleware;
