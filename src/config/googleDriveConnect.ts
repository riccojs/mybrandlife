import { Request, Response } from "express";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_BPS_REDIRECT_URI,
);

export const googleDriveConnect = (req: Request, res: Response) => {
  const scopes = ["https://www.googleapis.com/auth/drive.file"];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  res.redirect(authUrl);
};
