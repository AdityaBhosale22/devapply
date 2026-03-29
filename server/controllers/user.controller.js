import { getUserCredits as getUserCreditsValue } from "../utils/credits.js";

export const getUserCredits = async (req, res) => {
  try {
    const { userId } = req.auth();

    const credits = await getUserCreditsValue(userId);

    res.json({
      success: true,
      data: {
        credits_remaining: credits,
      },
    });


  } catch (err) {
    console.error("CREDITS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
};
