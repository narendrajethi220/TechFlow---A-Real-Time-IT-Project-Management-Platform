import { Router } from "express";
import userRoutes from "./users.routes.js";
const router = Router();

// Future routes: projects, tasks, etc.
router.use("/user", userRoutes);

export default router;
