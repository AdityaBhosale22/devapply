import { pool } from "../db/index.js";

export const getUsageAnalytics = async (req, res) => {
  try {
    const { userId } = req.auth();

    /* Total credits used */
    const totalCreditsResult = await pool.query(
      `SELECT COALESCE(SUM(credits_used), 0) AS total
       FROM activities
       WHERE user_id = $1`,
      [userId]
    );

    /* Credits by feature */
    const featureUsageResult = await pool.query(
      `SELECT feature,
              COUNT(*) AS usage_count,
              SUM(credits_used) AS credits_spent
       FROM activities
       WHERE user_id = $1
       GROUP BY feature`,
      [userId]
    );

    /* Daily usage trend */
    const dailyUsageResult = await pool.query(
      `SELECT DATE(created_at) AS date,
              SUM(credits_used) AS credits_spent
       FROM activities
       WHERE user_id = $1
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at)`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        totalCreditsUsed: Number(totalCreditsResult.rows[0].total),
        featureBreakdown: featureUsageResult.rows,
        dailyUsage: dailyUsageResult.rows,
      },
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};
