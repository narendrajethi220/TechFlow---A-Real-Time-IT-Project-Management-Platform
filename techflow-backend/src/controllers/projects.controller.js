import Project from "../models/Project.model.js";
import User from "../models/User.model.js";

const createProject = async (req, res, next) => {
  try {
    if (req.userInfo.role !== "admin") {
      const error = new Error("Only admins can create Projects");
      error.statusCode = 403;
      return next(error);
    }
    const { title, description, status, dueDate, members } = req.body;

    const validateUsers = await User.find({ _id: { $in: members } });
    if (validateUsers.length !== members.length) {
      const error = new Error("One or more member IDs are invalid");
      error.statusCode = 400;
      return next(error);
    }

    const newlyCreatedProject = new Project({
      title,
      description,
      owner: req.userInfo.userId,
      status,
      dueDate,
      members,
    });
    await newlyCreatedProject.save();
    const populatedProject = await Project.findById(newlyCreatedProject._id)
      .populate("owner", "name email role")
      .populate("members", "name email role");

    res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      project: populatedProject,
    });
  } catch (err) {
    next(err);
  }
};

const readProjects = async (req, res, next) => {
  try {
    const allProjects = await Project.find()
      .populate("owner", "name email role")
      .populate("members", "name email role");
    res.status(200).json({
      success: true,
      message: "Successfully fetched All Projects",
      data: allProjects,
    });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const updates = req.body;
    if (updates.members) {
      const validUsers = await User.find({ _id: { $in: updates.members } });
      if (validUsers.length !== updates.members.length) {
        const error = new Error("One or more IDs are invalid");
        error.statusCode = 400;
        return next(error);
      }
    }
    const project = await Project.findById(projectId);
    if (
      req.userInfo.role !== "admin" &&
      project.owner.toString() !== req.userInfo.userId
    ) {
      const error = new Error("Only Admins or owners can update projects");
      error.statusCode = 403;
      return next(error);
    }
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("owner", "name email role")
      .populate("members", "name email role");
    if (!updatedProject) {
      const error = new Error("No Project Found with the given ID");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
      data: updatedProject,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProjects = async (req, res, next) => {
  try {
    if (req.userInfo.role !== "admin") {
      const error = new Error("Only admins can delete projects");
      error.statusCode = 403;
      return next(error);
    }
    const projectId = req.params.id;
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      const error = new Error("No Project Found with the given ID");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default { createProject, readProjects, updateProject, deleteProjects };
