import { requireAuth } from "@clerk/express";

export const requireAuthMiddleware = requireAuth({
  authorizedParties: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [],
});
