import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Prisma } from "../utils/prisma.js";
import response from "../utils/response.js";
import SMTPTransport from "nodemailer/lib/smtp-transport";
const {
  NAME_RESPONSE,
  OUTRO_RESPONSE,
  SINGNATURE_RESPONSE,
  EMAIL_VERIFICATION_CODE_RESPONSE,
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

export async function registerEmail(
  name: string,
  email: string,
  userId: string,
  domain: string,
): Promise<number> {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const config: SMTPTransport.Options = {
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
      name: name,
      intro: `Welcome to ${domain}, powered by My Brand Life! We're excited to have you join the community. To complete your signup, please enter the verification code below.`,
      signature: SINGNATURE_RESPONSE,
      outro: `
      <p style="font-size: 16px; color: #777;"> Your Verification Code: <span style="font-size: 18px; font-weight: 500; color: #2a2a2aff;">${verificationCode}</span>, If you didn't create this account, you can safely ignore this email. Need help? Our team is here for you: ${supportMail}</p>
      <p style="font-size: 16px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
      <p style="font-size: 16px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  const mailOptions: nodemailer.SendMailOptions = {
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
