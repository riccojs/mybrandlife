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

async function onboardNotifyEmail(
  name: string,
  email: string,
  message: string,
  brandName: string,
  intro: string,
  subject: string,
  url: string,
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
  const emailTemplate = {
    body: {
      name: `${name}`,
      intro: intro,
      signature: SINGNATURE_RESPONSE,
      outro: `
        <p style="font-size: 17px; color: #777;">Brandname: ${brandName}</p>
        <p style="font-size: 16px; color: #777;">${message}</p>
        <p><a href="${url}" style="text-decoration: none; margin: 10px 0px; color: #000000; background-color: #95BF4D; padding: 10px 20px; border-radius: 5px">Check Onboard</a></p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
    },
  };
  const emailBody = mailGenerator.generate(emailTemplate);
  const mailOptions = {
    from: USER,
    to: email,
    subject: subject,
    html: emailBody,
  };
  await transporter.sendMail(mailOptions);
}

export default onboardNotifyEmail;
