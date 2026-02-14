import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import response from "../utils/response.js";
const { NAME_RESPONSE, OUTRO_RESPONSE, SINGNATURE_RESPONSE } = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

async function resetEmail(
  companyName: string,
  email: string,
  resetURL: string,
) {
  const transporter = nodemailer.createTransport({
    host: SERVER_KEY,
    port: SERVER_PORT,
    secure: true,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: NAME_RESPONSE,
      link: corsUrl,
      copyright: OUTRO_RESPONSE,
    },
  });
  const emailTemplate = {
    body: {
      name: companyName,
      intro: "You requested to reset your password.",
      dictionary: {
        message: `
          <p>Click below to reset your password:</p>
          <a href="${resetURL}" style="color: #4285F4; font-size: 16px;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
        `,
      },
      signature: SINGNATURE_RESPONSE,
      outro: `
        <p style="font-size: 14px; color: #777;">If you did not request this, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #4285F4;">
          <a href="${corsUrl}">${NAME_RESPONSE}</a>
        </p>
        <p style="font-size: 14px; color: #4285F4;">Email: ${supportMail}</p>
      `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  await transporter.sendMail({
    from: USER,
    to: email,
    subject: "Password Reset Link",
    html: emailBody,
  });
}

export default resetEmail;
