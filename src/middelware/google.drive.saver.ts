import getGoogleDrive from "../config/googleDrive.js";
import { Prisma } from "../utils/prisma.js";
import uploadFileToDrive from "./uploadFileToDrive.js";
import response from "../utils/response.js";

const {
  GOOGLE_DRIVE_FOLDER_ALREADY_EXIST_MESSAGE,
  GOOGLE_DRIVE_FOLDER_CREATE_FAILED_MESSAGE,
} = response;

interface DataType {
  brandName: string;
  googleEmail: string;
  membershipId: string;
  files: Record<string, Express.Multer.File[]>;
}

async function googleDriveSaver({
  brandName,
  googleEmail,
  membershipId,
  files,
}: DataType) {
  const getDrive = await Prisma.setting.findFirst();
  const token = getDrive?.refreshToken ?? "";
  const parrantId = getDrive?.parentFolderId ?? "";
  const drive = getGoogleDrive(token);

  const existingDrive = await Prisma.bpsMembershipDrive.findFirst({
    where: {
      membershipId: membershipId,
    },
  });
  if (existingDrive) {
    throw new Error(GOOGLE_DRIVE_FOLDER_ALREADY_EXIST_MESSAGE);
  }
  const folder = await drive.files.create({
    requestBody: {
      name: brandName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parrantId],
    },
    fields: "id,name,webViewLink",
  });
  const brandFolderId = folder.data.id;

  if (!brandFolderId) {
    throw new Error(GOOGLE_DRIVE_FOLDER_CREATE_FAILED_MESSAGE);
  }

  const permission = await drive.permissions.create({
    fileId: brandFolderId,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: googleEmail,
    },
    sendNotificationEmail: true,
  });

  const folderUrl =
    folder.data.webViewLink ??
    `https://drive.google.com/drive/folders/${brandFolderId}`;
  await Prisma.bpsMembershipDrive.create({
    data: {
      membershipId: membershipId,
      folderId: brandFolderId,
      folderUrl,
      clientGoogleEmail: googleEmail,
      accessStatus: permission.data.id ? "SHARED" : "PENDING",
      createdSharedAt: new Date(),
      sharedAt: permission.data.id ? new Date() : null,
    },
  });
  if (files.logo?.length) {
    await uploadFileToDrive(files.logo[0], brandFolderId, token);
  }
  if (files.cover?.length) {
    await uploadFileToDrive(files.cover[0], brandFolderId, token);
  }
  if (files.brandAssests?.length) {
    for (const product of files.brandAssests) {
      await uploadFileToDrive(product, brandFolderId, token);
    }
  }
  return {
    folderId: brandFolderId,
    folderUrl,
    accessStatus: permission.data.id ? "SHARED" : "PENDING",
  };
}

export default googleDriveSaver;
