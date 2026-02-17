import { pool } from "../db/index.js";

export const deductCredits = async (userId, cost) => {
  await pool.query(
    `UPDATE users
     SET credits_remaining = credits_remaining - $1
     WHERE id = $2`,
    [cost, userId]
  );
};
