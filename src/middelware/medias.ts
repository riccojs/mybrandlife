import multer from "multer";
import fs from "fs";
const uploadPath = process.env.PUBLIC_PATH as string;

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

const medias = upload.fields([
  { name: "headerImage", maxCount: 1 },
  { name: "logoImage", maxCount: 1 },
  { name: "bodyImage", maxCount: 1 },
  { name: "epkFile", maxCount: 1 },
  { name: "merchendiselogo", maxCount: 1 },
]);

export default medias;
