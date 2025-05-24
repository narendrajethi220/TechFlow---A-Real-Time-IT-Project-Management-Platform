import Project from "../models/Project.model.js";
import Task from "../models/Task.model.js";

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate, projectId, status } =
      req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error("No Project Found for respective ID");
      error.statusCode = 404;
      return next(error);
    }
    if (!project.members.includes(req.userInfo.userId)) {
      const error = new Error("User not a project member");
      error.statusCode = 400;
      return next(error);
    }
    const newlyCreatedTask = new Task({
      title,
      description,
      projectId,
      owner: req.userInfo.userId,
      assignedTo,
      dueDate,
      status,
    });

    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user || !project.members.includes(assignedTo)) {
        const error = new Error("Assigned User is not a project member");
        error.statusCode = 400;
        return next(error);
      }
    }

    await newlyCreatedTask.save();

    const populatedTask = await Task.findById(newlyCreatedTask._id)
      .populate("owner", "name email role")
      .populate("assignedTo", "name email role")
      .populate("projectId", "title");

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      task: populatedTask,
    });
  } catch (err) {
    next(err);
  }
};

const readTask = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      const error = new Error("No Project Found");
      error.statusCode(404);
      return next(error);
    }
    const tasks = await Task.find({ projectId })
      .populate("owner", "name email role")
      .populate("assignedTo", "name email role")
      .populate("projectId", "title");
    return res.status(200).json({
      success: true,
      message: tasks.length ? "Task fetched Successfully" : "No Task Found",
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const updated = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updated },
      { new: true, runValidators: true }
    )
      .populate("projectId", "title")
      .populate("owner", "name email role");

    if (!updatedTask) {
      const error = new Error("No Task Found with the given ID");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Task Updated Successfully",
      updatedTask,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const taskExists = await Task.findById(taskId);
    if (!taskExists) {
      const error = new Error("No Task Found!");
      error.statusCode = 404;
      return next(error);
    }
    const userId = req.userInfo.userId;
    if (String(taskExists.owner) != String(userId)) {
      const error = new Error("Only Owner can delete the Task");
      error.statusCode(401);
      return next(error);
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return res.status(200).json({
      success: true,
      message: "Task deleted Successfully",
      deletedTask,
    });
  } catch (err) {
    next(err);
  }
};

export default { createTask, readTask, updateTask, deleteTask };
