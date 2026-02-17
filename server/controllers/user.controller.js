import { pool } from "../db/index.js";

export const getUserCredits = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { rows } = await pool.query(
      `SELECT credits_remaining FROM users WHERE id = $1`,
      [userId]
    );

    console.log("Credits Query Rows:", rows);

    res.json({
  success: true,
  data: rows[0],
});


  } catch (err) {
    console.error("CREDITS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
};
