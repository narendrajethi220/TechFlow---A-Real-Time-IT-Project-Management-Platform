import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in .env");
}
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = new Error("Access Denied!");
    error.name = "JsonWebTokenError";
    error.statusCode = 401;
    return next(error);
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    req.userInfo = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
