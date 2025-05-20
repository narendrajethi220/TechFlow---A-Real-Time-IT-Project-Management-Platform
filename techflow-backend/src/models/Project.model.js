import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minLength: 5 },
    description: { type: String, required: true, minLength: 10 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "On-Hold", "Completed"],
      default: "On-Hold",
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => date > new Date(),
        message: "Due date must be in the future",
      },
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
