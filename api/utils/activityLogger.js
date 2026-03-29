import { pool } from "../db/index.js";

export const logActivity = async ({
  userId,
  feature,
  prompt,
  result,
  creditsUsed,
}) => {
  try {
    await pool.query(
      `INSERT INTO activities 
       (user_id, feature, prompt, result, credits_used)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, feature, prompt, result, creditsUsed]
    );

    console.log("📊 Activity Logged:", feature);

  } catch (err) {
    console.error("ACTIVITY LOG ERROR:", err);
  }
};
