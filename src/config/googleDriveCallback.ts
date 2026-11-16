import { Request, Response } from "express";
import { google } from "googleapis";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_BPS_REDIRECT_URI,
);
const { ERROR_STATUS } = status;

export const googleDriveCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { tokens } = await oauth2Client.getToken(code);
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    oauth2Client.setCredentials(tokens);
    const about = await drive.about.get({
      fields: "user,storageQuota",
    });

    const rootFolderId = about.data.user?.permissionId ? "root" : "";
    const refreshToken = tokens?.refresh_token ? tokens?.refresh_token : "";
    const email = about.data.user?.emailAddress;
    const getSetting = await Prisma.setting.findFirst();

    if (getSetting?.id) {
      await Prisma.setting.update({
        where: {
          id: getSetting?.id,
        },
        data: {
          accountEmail: email,
          refreshToken: refreshToken,
          rootFolderId: "root",
          parentFolderId: rootFolderId,
        },
      });
    }
    res.redirect(`${process.env.BPS_CORS_URL}/auth/google/connect/successful`);
  } catch (error: any) {
    return res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
};
