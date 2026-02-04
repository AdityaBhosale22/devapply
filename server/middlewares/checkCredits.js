export const checkCredits = (cost) => {
  return async (req, res, next) => {
    const user = req.user;

    if (user.credits < cost) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits"
      });
    }

    req.creditCost = cost;
    next();
  };
};
