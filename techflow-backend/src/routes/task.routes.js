import Router from "express";
const router = Router();
import tasksController from "../controllers/tasks.controller.js";

router.post("/create", tasksController.createTask);
router.get("/get", (req, res) => {
  res.send("Hello Routes");
});

export default router;
