import multer from "multer";
import path from "path";

// Storage config (save locally)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/csv/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

// File filter — allow ONLY CSV
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== ".csv") {
    return cb(new Error("Only CSV files allowed"));
  }

  cb(null, true);
};

const uploadCsv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default uploadCsv;
