import { Router } from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import projectSchema from "../validators/project.validate.js";
import projectController from "../controllers/projects.controller.js";

const router = Router();

router.post(
  "/",
  adminMiddleware,
  validateRequest(projectSchema),
  projectController.createProject
);

router.get("/", projectController.readProjects);
router.put(
  "/:id",
  validateRequest(projectSchema),
  projectController.updateProject
);
router.delete("/:id", adminMiddleware, projectController.deleteProjects);

export default router;
