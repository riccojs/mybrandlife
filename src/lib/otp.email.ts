import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import response from "../utils/response.js";
import { Prisma } from "../utils/prisma.js";
const {
  NAME_RESPONSE,
  OUTRO_RESPONSE,
  SINGNATURE_RESPONSE,
  EMAIL_VERIFICATION_CODE_RESPONSE,
  IGNORE_EMAIL_RESPONSE,
  USE_VERIFICATION_CODE_TO_VERIFY_EMAIL_RESPONSE,
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

async function otpEmail(companyName: string, email: string, userId: string) {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

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

  const emailTemplate = {
    body: {
      name: `${companyName}`,
      intro: USE_VERIFICATION_CODE_TO_VERIFY_EMAIL_RESPONSE,
      signature: SINGNATURE_RESPONSE,
      table: {
        data: [
          {
            "Your Verification Code": verificationCode,
          },
        ],
      },
      outro: `<p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>`,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  const mailOptions = {
    from: USER,
    to: email,
    subject: EMAIL_VERIFICATION_CODE_RESPONSE,
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
  await Prisma.otpModel.create({
    data: {
      code: verificationCode,
      email: email,
      userId: userId,
      expireIn: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
  return verificationCode;
}

export default otpEmail;
