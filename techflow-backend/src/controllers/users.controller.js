import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const registrationController = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      const error = new Error("User Already Exists");
      error.statusCode = 400;
      return next(error);
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newlyCreatedUser = await User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || "Developer",
    });
    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user: { id: newlyCreatedUser, name, email, role },
      });
    } else {
      const error = new Error("Unable to register User");
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    next(err);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      const error = new Error("Invalid User Credentials");
      error.statusCode = 401;
      return next(error);
    }
    const isCorrectPassword = await bcryptjs.compare(
      password,
      userExists.password
    );

    if (!isCorrectPassword) {
      const error = new Error("Invalid User Credentials");
      error.statusCode = 401;
      return next(error);
    }

    const accessToken = jwt.sign(
      {
        userId: userExists._id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
    res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

export default { registrationController, loginController };
