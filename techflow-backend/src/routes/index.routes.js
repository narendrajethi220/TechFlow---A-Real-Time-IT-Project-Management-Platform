import { Router } from "express";
import userRoutes from "./users.routes.js";
import projectRoutes from "./projects.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Future routes: projects, tasks, etc.
router.use("/user", userRoutes);
router.use("/project", authMiddleware, projectRoutes);

export default router;
