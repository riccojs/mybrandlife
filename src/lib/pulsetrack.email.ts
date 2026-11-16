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

async function pulsetrackEmail(
  username: string,
  cost: number,
  userId: string,
  city: string,
  zip: string,
  address: string,
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
      name: `${username}`,
      intro: `You've received an order from ${username}`,
      table: {
        data: [
          { item: "Total Cost", description: cost },
          { item: "User ID", description: userId },
          { item: "User City", description: `${city}` },
          { item: "USer Zip", description: zip },
          { item: "USer Address", description: address },
        ],
      },
      outro: `
          <p>If you have any questions, feel free to contact our support team.</p>
          <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
          <p>
            <a href="${corsUrl}" style="color: #4285F4;">${NAME_RESPONSE}</a>
          </p>
          <p>E-mail: ${supportMail}</p>
        `,
      signature: SINGNATURE_RESPONSE,
    },
  };

  const emailBody = mailGenerator.generate(emailTemplate);

  await transporter.sendMail({
    from: USER,
    to: USER,
    subject: `You've received an order from ${username}`,
    html: emailBody,
  });
}

export default pulsetrackEmail;
