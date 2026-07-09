import express from "express";
import { requireAuthMiddleware } from "../middlewares/auth.middleware.js";
import { getUserCredits } from "../utils/credits.js";
import { validateSubscription } from "../utils/subscriptionGuard.js";

const router = express.Router();

router.get(
  "/resume-info",
  requireAuthMiddleware,
  async (req, res) => {
    try {
      const authObj = req.auth ? req.auth() : null;
      const userId = authObj?.userId;

      const credits = userId ? await getUserCredits(userId) : null;
      const sub = userId ? await validateSubscription(userId) : null;

      res.json({ success: true, auth: authObj, credits, subscription: sub });
    } catch (err) {
      console.error("Debug route error:", err);
      res.status(500).json({ success: false, message: "Debug route failed" });
    }
  }
);

export default router;
