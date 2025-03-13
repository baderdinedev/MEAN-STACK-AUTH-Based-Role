class ResponseHandler {
  static success(res, message = "Success", data = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message = "Created successfully", data = {}) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res,
    message = "Something went wrong",
    status = 500,
    error = null
  ) {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  }

  static notFound(res, message = "Resource not found") {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static unauthorized(res, message = "Unauthorized access") {
    return res.status(401).json({
      success: false,
      message,
    });
  }
}

export default ResponseHandler;
