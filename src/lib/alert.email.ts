import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import response from "../utils/response.js";
const { OUTRO_RESPONSE, SINGNATURE_RESPONSE } = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

async function alertEmail(
  introMessage: string,
  subjectMessage: string,
  bodyMessage: string,
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
      name: "The MyBrandLife.me Team",
      link: corsUrl,
      copyright: OUTRO_RESPONSE,
    },
  });
  const emailTemplate = {
    body: {
      name: "The MyBrandLife.me Team",
      intro: introMessage,
      dictionary: {
        message: bodyMessage,
      },
      signature: SINGNATURE_RESPONSE,
      outro: `
                <p style="font-size: 14px; color: #555;">
                    This is an automated notification that a new update has been successfully deployed.
                </p>
                <p style="font-size: 14px; color: #555;">
                    Please log in to the admin dashboard to review the changes and ensure everything is functioning as expected.
                </p>
                <p style="font-size: 14px; color: #555;">
                    No further action is required unless otherwise specified.
                </p>
                <p style="font-size: 14px; color: #4285F4;">
                    <a href="${corsUrl}">Open Admin Dashboard</a>
                </p>
                <p style="font-size: 13px; color: #777;">
                    Support Contact: ${supportMail}
                </p>
                `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  await transporter.sendMail({
    from: USER,
    to: USER,
    subject: subjectMessage,
    html: emailBody,
  });
}

export default alertEmail;
