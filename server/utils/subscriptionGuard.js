import { pool } from "../db/index.js";

export const validateSubscription = async (userId) => {
    const { rows } = await pool.query(
        `SELECT *
     FROM subscriptions
     WHERE user_id = $1
     AND status = 'active'
     ORDER BY created_at DESC
     LIMIT 1`,
        [userId]
    );

    if (!rows.length) return { valid: false };

    const subscription = rows[0];

    const isExpired = new Date(subscription.end_date) < new Date();

    if (isExpired) {
        await pool.query(
            `UPDATE subscriptions
       SET status = 'expired'
       WHERE id = $1`,
            [subscription.id]
        );

        return { valid: false, expired: true };
    }
    if (isExpired) {

        await pool.query(
            `UPDATE users
     SET credits_remaining = $1
     WHERE id = $2`,
            [PLAN_CONFIG.free.credits, userId]
        );

        return { valid: false, expired: true };
    }

    return { valid: true, subscription };
};