import { pool } from "../db/index.js";

const DEFAULT_FREE_CREDITS = 100;
let cachedCreditsColumn = null;

const detectCreditsColumn = async () => {
  if (cachedCreditsColumn) return cachedCreditsColumn;

  const { rows } = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = 'users'
       AND column_name IN ('credits_remaining', 'credits')`
  );

  const available = rows.map((r) => r.column_name);

  if (available.includes("credits_remaining")) {
    cachedCreditsColumn = "credits_remaining";
    return cachedCreditsColumn;
  }

  if (available.includes("credits")) {
    cachedCreditsColumn = "credits";
    return cachedCreditsColumn;
  }

  throw new Error("No credits column found in users table");
};

const ensureUserRowWithCredits = async (userId, column) => {
  await pool.query(
    `INSERT INTO users (id, ${column})
     VALUES ($1, $2)
     ON CONFLICT (id) DO NOTHING`,
    [userId, DEFAULT_FREE_CREDITS]
  );
};

export const getUserCredits = async (userId) => {
  try {
    const creditsColumn = await detectCreditsColumn();
    const { rows } = await pool.query(
      `SELECT ${creditsColumn} AS credits
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (!rows.length) {
      await ensureUserRowWithCredits(userId, creditsColumn);
      return DEFAULT_FREE_CREDITS;
    }

    return Number(rows[0].credits || 0);
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
};

export const deductCredits = async (userId, amount) => {
  try {
    const creditsColumn = await detectCreditsColumn();
    await ensureUserRowWithCredits(userId, creditsColumn);

    await pool.query(
      `UPDATE users
       SET ${creditsColumn} = GREATEST(${creditsColumn} - $1, 0)
       WHERE id = $2`,
      [amount, userId]
    );
  } catch (error) {
    console.error("Error deducting credits:", error);
    throw new Error("Failed to deduct credits");
  }
};