import { pool } from "../db/index.js";

export const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { rows } = await pool.query(
      `SELECT * FROM activities
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error("ACTIVITIES ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
    });
  }
};
