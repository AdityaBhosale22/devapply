// utils/credits.js
import pg from "pg";

const { Pool } = pg;

// Keep this util consistent with the rest of the backend:
// - credits middleware checks `credits_remaining`
// - subscription upgrades write `credits_remaining`
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Neon requires SSL
});

const DEFAULT_CREDITS = 100;

export const getUserCredits = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT credits_remaining FROM users WHERE id = $1",
      [userId]
    );

    // If user row doesn't exist yet, initialize credits so endpoints still work.
    if (result.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (id, credits_remaining) VALUES ($1, $2)",
        [userId, DEFAULT_CREDITS]
      );
      return DEFAULT_CREDITS;
    }

    return Number(result.rows[0].credits_remaining ?? 0);
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
};

export const deductCredits = async (userId, amount) => {
  try {
    await pool.query(
      "UPDATE users SET credits_remaining = GREATEST(0, COALESCE(credits_remaining, 0) - $1) WHERE id = $2",
      [amount, userId]
    );
  } catch (error) {
    console.error("Error deducting credits:", error);
    throw new Error("Failed to deduct credits");
  }
};