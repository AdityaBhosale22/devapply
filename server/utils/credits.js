// utils/credits.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Neon requires SSL
});

export const getUserCredits = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT credits FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) return 0;
    return result.rows[0].credits;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0;
  }
};

export const deductCredits = async (userId, amount) => {
  try {
    await pool.query(
      'UPDATE users SET credits = credits - $1 WHERE id = $2',
      [amount, userId]
    );
  } catch (error) {
    console.error("Error deducting credits:", error);
    throw new Error("Failed to deduct credits");
  }
};