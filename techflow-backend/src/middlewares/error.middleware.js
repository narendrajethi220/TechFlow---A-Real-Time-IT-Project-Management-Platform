const errorMiddleware = (err, req, res, next) => {
  console.error("🚨 Error:", err.message, "Type =>", err.name);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "JsonWebTokenError") {
    message = "No/Invalid token";
    statusCode = 401;
  } else if (err.name === "TokenExpiredError") {
    message = "Session expired. Please Login Again";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export default errorMiddleware;
