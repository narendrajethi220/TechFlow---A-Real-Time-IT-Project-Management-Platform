import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const registrationController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
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
      res.status(400).json({
        success: false,
        message: "Unable to register User",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Error while Registering User, Please try again !",
      data: err.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Invalid User Credentials",
      });
    }
    const isCorrectPassword = await bcryptjs.compare(
      password,
      userExists.password
    );

    if (!isCorrectPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid User Credentials",
      });
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
    res.status(500).json({
      success: false,
      message: "Internal Error while Login User",
      data: err.message,
    });
  }
};

export default { registrationController, loginController };
