import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enums: ["ToDo", "In-Progress", "Done"],
      default: "ToDo",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (date) => date > new Date(),
        message: "Due date must be in the future",
      },
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
