import { Router } from "express";
import userSchema from "../validators/user.validate.js";
import validateRequest from "../middlewares/validateRequest.js";

import userControllers from "../controllers/users.controller.js";

const router = Router();

router.post(
  "/register",
  validateRequest(userSchema.registrationSchema),
  userControllers.registrationController
);
router.post(
  "/login",
  validateRequest(userSchema.loginSchema),
  userControllers.loginController
);

export default router;
