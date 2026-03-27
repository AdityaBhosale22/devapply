import { pool } from "../db/index.js";

export const validateSubscription = async (
    userId,
    sessionClaims,
    requiredFeature
) => {

    console.log("=== SUBSCRIPTION CHECK ===");

    const clerkPlan = sessionClaims?.pla;
    const clerkStatus = sessionClaims?.sts;
    const features = sessionClaims?.fea || "";

    console.log("Plan:", clerkPlan);
    console.log("Status:", clerkStatus);
    console.log("Features:", features);

    if (!userId) {
        return { valid: false };
    }

    if (clerkStatus !== "active") {
        return { valid: false };
    }

    // check feature permission
    if (!features.includes(requiredFeature)) {

        console.log("Feature not allowed:", requiredFeature);

        return {
            valid: false,
            reason: "feature_not_allowed"
        };
    }

    // ensure DB subscription exists
    const { rows } = await pool.query(
        `SELECT *
         FROM subscriptions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
    );

    if (!rows.length) {

        await pool.query(
            `INSERT INTO subscriptions
            (user_id, plan_type, credits_allocated, status, start_date, end_date)
            VALUES ($1, $2, $3, 'active', NOW(), NOW() + interval '30 days')`,
            [userId, clerkPlan || "u:free", 100]
        );

        console.log("Subscription auto-created");
    }

    return { valid: true };
};