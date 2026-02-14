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

async function welcomeEmail(companyName: string, email: string) {
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
      intro: `
        Congratulations! Your account has been successfully verified.  
        You're now ready to start exploring all features of ${NAME_RESPONSE}.
      `,
      dictionary: {
        message: `
          <p>We're thrilled to have you onboard.</p>
          <p>You can log in anytime and start using your dashboard.</p>
          <a href="${corsUrl}/auth/login" style="color: #4285F4; font-size: 16px;">
            Go to Dashboard
          </a>
        `,
      },
      signature: SINGNATURE_RESPONSE,
      outro: `
        <p style="font-size: 14px; color: #777;">
          If you have any questions, feel free to reach out.
        </p>
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
    subject: "Welcome to " + NAME_RESPONSE + "!",
    html: emailBody,
  });
}

export default welcomeEmail;
