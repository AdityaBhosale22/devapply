import { getUserCredits } from "../utils/credits.js";

export const checkCredits = (cost) => {
    return async (req, res, next) => {
        try {
            console.log("✅ Credits middleware loaded");
            console.log("=== CREDITS MIDDLEWARE START ===");
            console.log("Auth Object:", req.auth());


            // ✅ CORRECT FOR YOUR CUSTOM AUTH MIDDLEWARE
            const userId = req.auth()?.userId;

            console.log("User ID:", userId);

            const credits = await getUserCredits(userId);

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
