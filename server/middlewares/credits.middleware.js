import { pool } from "../db/index.js";

export const checkCredits = (cost) => {
    return async (req, res, next) => {
        try {
            console.log("✅ Credits middleware loaded");
            console.log("=== CREDITS MIDDLEWARE START ===");
            console.log("Auth Object:", req.auth());


            // ✅ CORRECT FOR YOUR CUSTOM AUTH MIDDLEWARE
            const userId = req.auth()?.userId;

            console.log("User ID:", userId);

            const { rows } = await pool.query(
                `SELECT credits_remaining FROM users WHERE id = $1`,
                [userId]
            );

            if (!rows.length) {
                await pool.query(
                    `INSERT INTO users (id, credits_remaining)
     VALUES ($1, 100)`,
                    [userId]
                );

                console.log("🆕 User auto-created with 100 credits");

                return next();
            }


            const credits = rows[0].credits_remaining;

            console.log("User Credits:", credits);

            if (credits < cost) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient credits",
                });
            }

            req.credits = credits;
            next();

        } catch (err) {
            console.error("CREDITS ERROR:", err);
            res.status(500).json({
                success: false,
                message: "Credits check failed",
            });
        }
    };
};
