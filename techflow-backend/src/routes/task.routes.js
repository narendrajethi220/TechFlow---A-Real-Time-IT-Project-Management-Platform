import { Router } from "express";
const router = Router();
import tasksController from "../controllers/tasks.controller.js";
import taskSchema from "../validators/task.validate.js";
import validateRequest from "../middlewares/validateRequest.js";

router.post("/", validateRequest(taskSchema), tasksController.createTask);
router.get("/", tasksController.readTask);
router.put(
  "/:taskId",
  validateRequest(taskSchema.partial()),
  tasksController.updateTask
);
router.delete("/:taskId", tasksController.deleteTask);

export default router;
