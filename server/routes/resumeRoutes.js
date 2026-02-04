router.post(
  "/analyze",
  authMiddleware,
  checkCredits(5),
  upload.single("resume"),
  analyzeResume
);
