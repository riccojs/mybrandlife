import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Request, Response } from "express";
import status from "../utils/status.js";
import response from "../utils/response.js";
const {
  NAME_RESPONSE,
  OUTRO_RESPONSE,
  SINGNATURE_RESPONSE,
  IGNORE_EMAIL_RESPONSE,
  FORM_SUBMIT_SUCCESSFUL,
  NO_RECIPENT_EMAIL_PROVIDED,
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;
const { SUCCESS_STATUS, ERROR_STATUS } = status;

async function partnerEmail(req: Request, res: Response) {
  const { firstname, lastname, phone, email, detail, recipent, title } =
    req.body;
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
    const recipients: string[] = Array.isArray(recipent) ? recipent : [];

    if (recipients.length === 0) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: NO_RECIPENT_EMAIL_PROVIDED,
      });
    }
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
        intro: `You have received a email request from ${
          firstname + " " + lastname
        }`,
        signature: SINGNATURE_RESPONSE,
        outro: `
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">First name:</strong>
          <p style="font-size: 14px; color: #555;">${firstname}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Last name:</strong>
          <p style="font-size: 14px; color: #555;">${lastname}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Email:</strong>
          <p style="font-size: 14px; color: #555;">${email}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Phone number:</strong>
          <p style="font-size: 14px; color: #555;">${phone}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Details:</strong>
          <p style="font-size: 14px; color: #555;">${detail}</p>
        </div>
        <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
      },
    };
    const emailBody = mailGenerator.generate(emailTemplate);
    await transporter.sendMail({
      from: supportMail,
      to: recipients,
      subject: title,
      html: emailBody,
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: FORM_SUBMIT_SUCCESSFUL,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

export default partnerEmail;
