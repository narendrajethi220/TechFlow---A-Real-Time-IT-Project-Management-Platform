import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minLength: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trime: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "developer", "tester"],
      default: "developer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
