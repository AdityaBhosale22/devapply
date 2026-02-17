import { pool } from "../db/index.js";
import { PLAN_CONFIG } from "../configs/plans.js";

export const upgradePlan = async (req, res) => {
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

        // Expire previous subscriptions
        await pool.query(
            `UPDATE subscriptions
       SET status = 'expired', end_date = NOW()
       WHERE user_id = $1 AND status = 'active'`,
            [userId]
        );

        // Create new subscription
        await pool.query(
            `INSERT INTO subscriptions (user_id, plan_type, credits_allocated)
       VALUES ($1, $2, $3)`,
            [userId, planType, credits]
        );

        // Update user credits
        await pool.query(
            `UPDATE users
       SET credits_remaining = $1
       WHERE id = $2`,
            [credits, userId]
        );

        res.json({
            success: true,
            message: "Plan upgraded successfully 🚀",
        });


    } catch (err) {
        console.error("UPGRADE ERROR:", err);

        res.status(500).json({
            success: false,
            message: "Upgrade failed",
        });
    }
};
