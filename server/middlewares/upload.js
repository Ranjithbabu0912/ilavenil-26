import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/payments",
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG/JPG allowed"));
    }
  },
});

export default upload;
