const adminMiddleware = (req, res, next) => {
  if (!req.userInfo || req.userInfo.role !== "Admin") {
    const error = new Error(
      "You are not Authorized to Access this Page. Admin Rights Required."
    );
    error.name = "AuthorizationError";
    error.statusCode = 403;
    return next(error);
  }
  next();
};
export default adminMiddleware;
