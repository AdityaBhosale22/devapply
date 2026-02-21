import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { generateProjectBullets } from "../controllers/projectBullets.controller.js";

const router = express.Router();

router.post("/", requireAuthMiddleware, generateProjectBullets);

export default router;