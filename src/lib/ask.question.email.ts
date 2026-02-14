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
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;
const { SUCCESS_STATUS, ERROR_STATUS } = status;

async function askQuestionEmail(req: Request, res: Response) {
  const { email, phone, note, domain, lander, location } = req.body;

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
    let emailTemplate = {
      body: {
        name: `MY BRAND LIFE`,
        intro: `You have received a email request from ask for help foram`,
        signature: SINGNATURE_RESPONSE,
        outro: `
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Email:</strong>
          <p style="font-size: 14px; color: #555;">${email}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Phone:</strong>
          <p style="font-size: 14px; color: #555;">${phone}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Note:</strong>
          <p style="font-size: 14px; color: #555;">${note}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Domain:</strong>
          <p style="font-size: 14px; color: #555;">${
            domain ? domain : "empty"
          }</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Lander:</strong>
          <p style="font-size: 14px; color: #555;">${
            lander ? lander : "empty"
          }</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">Location:</strong>
          <p style="font-size: 14px; color: #555;">${
            location ? location : "empty"
          }</p>
        </div>
        <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
      },
    };
    const emailBody = mailGenerator.generate(emailTemplate);
    await transporter.sendMail({
      from: email,
      to: supportMail,
      subject: "Recive a email from ask for help foram",
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

export default askQuestionEmail;
