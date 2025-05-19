import { Router } from "express";

const router = Router();

router.get("/create", (req, res) => {
  res.send("Welcome to Project Creation Page");
});

export default router;
