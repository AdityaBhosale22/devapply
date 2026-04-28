import { pool } from "../db/index.js";

export const validateSubscription = async (userId) => {
    // Allow skipping subscription checks in non-production/dev debugging
    if (process.env.SKIP_SUBSCRIPTION_CHECK === 'true') {
        return { valid: true, subscription: null };
    }
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

    return { valid: true, subscription };
};