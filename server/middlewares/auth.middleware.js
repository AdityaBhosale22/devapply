import { requireAuth } from "@clerk/express";

// Only pass `authorizedParties` when a FRONTEND_URL is provided.
// Passing an empty array causes Clerk to reject all tokens.
export const requireAuthMiddleware = process.env.FRONTEND_URL
  ? requireAuth({ authorizedParties: [process.env.FRONTEND_URL] })
  : requireAuth();
