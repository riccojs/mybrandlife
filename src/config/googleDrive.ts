import { google } from "googleapis";

const getGoogleDrive = (refreshToken: string) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_BPS_REDIRECT_URI;
  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  auth.setCredentials({
    refresh_token: refreshToken,
  });
  return google.drive({
    version: "v3",
    auth,
  });
};

export default getGoogleDrive;
