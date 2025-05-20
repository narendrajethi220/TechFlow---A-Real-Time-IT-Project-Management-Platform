import Project from "../models/Project.model.js";

const createProject = async (req, res, next) => {
  try {
    const { title, description, status, dueDate, members } = req.body;
    const newlyCreatedProject = new Project({
      title,
      description,
      owner: req.userInfo.userId,
      status,
      dueDate,
      members,
    });
    await newlyCreatedProject.save();
    res.status(201).json({
      success: true,
      message: "Project Created Successfully",
      project: newlyCreatedProject,
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
