import { pool } from "../db/index.js";
import { PLAN_CONFIG } from "../configs/plans.js";

export const upgradePlan = async (req, res) => {
    const client = await pool.connect();

    try {
        const { userId } = req.auth();
        const { planType } = req.body;

        console.log("BODY:", req.body);

        if (!PLAN_CONFIG[planType]) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan selected",
            });
        }

        const credits = PLAN_CONFIG[planType].credits;

        await client.query("BEGIN");

        await client.query(
            `UPDATE subscriptions
             SET status = 'expired', end_date = NOW()
             WHERE user_id = $1 AND status = 'active'`,
            [userId]
        );

        const expiryDays = PLAN_CONFIG[planType].duration_days;

        await client.query(
            `INSERT INTO subscriptions (
      user_id,
      plan_type,
      credits_allocated,
      status,
      end_date
  )
  VALUES ($1, $2, $3, 'active', NOW() + ($4 || ' days')::INTERVAL)`,
            [userId, planType, credits, expiryDays]
        );

        await client.query(
            `UPDATE users
             SET credits_remaining = $1
             WHERE id = $2`,
            [credits, userId]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "Plan upgraded successfully 🚀",
        });

    } catch (err) {
        await client.query("ROLLBACK");

        console.error("UPGRADE ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Upgrade failed",
        });

    } finally {
        client.release();
    }
};

export const getCurrentSubscription = async (req, res) => {
    try {
        const { userId } = req.auth();

        const { rows } = await pool.query(
            `SELECT plan_type
       FROM subscriptions
       WHERE user_id = $1
       AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 1`,
            [userId]
        );

        res.json({
            success: true,
            data: rows[0] || { plan_type: "free" },
        });

    } catch (err) {
        console.error("SUBSCRIPTION FETCH ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subscription",
        });
    }
};