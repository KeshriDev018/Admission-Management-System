import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "admission-documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024, // ⭐ 2MB limit
  },
});

export default upload;
