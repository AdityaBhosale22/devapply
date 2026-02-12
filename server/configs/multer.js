import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,   // 👈 IMPORTANT
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter(req, file, cb) {
    if (!file.mimetype.includes("pdf")) {
      cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});