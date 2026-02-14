import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import response from "../utils/response.js";
const {
  NAME_RESPONSE,
  OUTRO_RESPONSE,
  SINGNATURE_RESPONSE,
  IGNORE_EMAIL_RESPONSE,
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

async function echoEmail(
  name: string,
  email: string,
  city: string,
  message: string,
  shoutout: string,
  tip: number,
  enabled: boolean,
) {
  let config = {
    host: SERVER_KEY,
    port: SERVER_PORT,
    secure: true,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(config);
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: NAME_RESPONSE,
      link: corsUrl,
      copyright: OUTRO_RESPONSE,
    },
  });
  let emailTemplate = {
    body: {
      name: `MY BRAND LIFE`,
      intro: `You have received a email for ECHO request`,
      signature: SINGNATURE_RESPONSE,
      outro: `
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Name:</strong>
          <p style="font-size: 14px; color: #555;">${name}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Email:</strong>
          <p style="font-size: 14px; color: #555;">${email}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">City:</strong>
          <p style="font-size: 14px; color: #555;">${city ? city : "empty"}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Message:</strong>
          <p style="font-size: 14px; color: #555;">${message}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Shoutout:</strong>
          <p style="font-size: 14px; color: #555;">${
            shoutout ? shoutout : "empty"
          }</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Tip:</strong>
          <p style="font-size: 14px; color: #555;">${tip ? tip : 0}</p>
        </div>
        ${
          enabled
            ? `
              <div style="margin: 20px 0; display: flex;">
                <a href="${corsUrl}/echo" style="padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Confirm</a>
                <a href="${corsUrl}/echo" style="padding: 10px 20px; background-color: #f0ad4e; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">Cancel</a>
                <a href="${corsUrl}/echo" style="padding: 10px 20px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reject</a>
              </div>
            `
            : ""
        }
        <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  const mailOptions = {
    from: USER,
    to: email,
    subject: "Notification from My Brand Life",
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
}

export default echoEmail;
