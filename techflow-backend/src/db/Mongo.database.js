import mongoose from "mongoose";
import dotenv from "dotenv";
import dbName from "../utils/Db.utils.js";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName,
    });
    console.log("Connected to Database Successfully ✅");
  } catch (err) {
    console.log("Error while connecting to the database", err.message);
  }
};

export default connectToDb;
