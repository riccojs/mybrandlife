import multer from "multer";
import fs from "fs";
const uploadPath = process.env.PUBLIC_PATH || "public";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^\w.-]/g, "");

    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: Storage,
});

const bpsMedias = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "cover", maxCount: 1 },
  { name: "brandAssests", maxCount: 5 },
]);

export default bpsMedias;
