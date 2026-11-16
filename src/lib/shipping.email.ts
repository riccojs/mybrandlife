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

async function ShippingEmail(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  orderId: string,
  shippingStatus: string,
) {
  try {
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
        name: `${firstName}`,
        intro: `Your wristband shipping status has been updated.`,
        table: {
          data: [
            { item: "Order ID", description: orderId },
            { item: "Shipping Status", description: shippingStatus },
            { item: "Name", description: `${firstName} ${lastName}` },
            { item: "Phone", description: phone },
            { item: "Email", description: email },
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
      from: supportMail,
      to: email,
      subject: `Shipping Update - ${shippingStatus}`,
      html: emailBody,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export default ShippingEmail;
