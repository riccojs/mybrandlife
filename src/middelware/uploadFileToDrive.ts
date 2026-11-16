import fs from "fs";
import getGoogleDrive from "../config/googleDrive.js";

async function uploadFileToDrive(
  file: Express.Multer.File,
  folderId: string,
  refreshToken: string,
) {
  const drive = getGoogleDrive(refreshToken);

  const response = await drive.files.create({
    requestBody: {
      name: file.originalname,
      parents: [folderId],
    },
    media: {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    },
    fields: "id,name,webViewLink",
  });

  return response.data;
}

export default uploadFileToDrive;
