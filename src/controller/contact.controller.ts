import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  SINGNATURE_RESPONSE,
  NAME_RESPONSE,
  DATA_NOT_FOUND_MESSAGE,
  IGNORE_EMAIL_RESPONSE,
  OUTRO_RESPONSE,
  MESSAGE_SEND_SUCCESSFUL_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;
const corsUrl = process.env.FRONTEND_CORS_URL ?? "";
const supportMail = process.env.SUPPORT_MAIL ?? "";
const USER = process.env.EMAIL_USER ?? "";
const PASSWORD = process.env.EMAIL_PASSWORD ?? "";
const SERVER_KEY = process.env.EMAIL_SERVER_KEY ?? "";
const SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT) || 465;

// get all contacts
export async function getAllContact(req: Request, res: Response) {
  const { searchBy, statusBy } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  const filter: any = {};
  if (searchBy) {
    filter.firstname = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (statusBy) {
    filter.seen = statusBy === "seen" ? true : false;
  }
  try {
    const contact = await Prisma.contact.findMany({
      skip: skip,
      take: limit,
      where: filter,
    });
    const totalContact = await Prisma.contact.count({ where: filter });
    const totalPage = Math.ceil(totalContact / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        contact,
        totalPage,
        totalContact,
        currentPage: page,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one contacts
export async function getOneContact(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      contact: existContact,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create contacts
export async function createContact(req: Request, res: Response) {
  const { firstname, email, message, subject, phone, niche, lastname } =
    req.body;
  try {
    const newMessage = await Prisma.contact.create({
      data: {
        email: email,
        message: message,
        subject: subject,
        phone: phone,
        firstname: firstname,
        lastname: lastname,
        niche: niche,
      },
    });
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
    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "MY BRAND LIFE",
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
          <strong style="font-size: 16px;">User first name:</strong>
          <p style="font-size: 14px; color: #555;">${firstname}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User last name:</strong>
          <p style="font-size: 14px; color: #555;">${lastname}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User email:</strong>
          <p style="font-size: 14px; color: #555;">${email}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User phone number:</strong>
          <p style="font-size: 14px; color: #555;">${phone}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User niche:</strong>
          <p style="font-size: 14px; color: #555;">${niche}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User subject:</strong>
          <p style="font-size: 14px; color: #555;">${subject}</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin: 20px 0; padding-top: 10px;">
          <strong style="font-size: 16px;">User message:</strong>
          <p style="font-size: 14px; color: #555;">${message}</p>
        </div>
        <p style="font-size: 14px; color: #777;">${IGNORE_EMAIL_RESPONSE}</p>
        <p style="font-size: 14px; color: #4285F4;"><a href="${corsUrl}">${NAME_RESPONSE}</a></p>
        <p style="font-size: 14px; color: #4285F4;">E-mail: ${supportMail}</p>
      `,
      },
    };
    const emailBody = mailGenerator.generate(emailTemplate);
    const mailOptions = {
      from: USER,
      to: USER,
      subject: "Email request received",
      html: emailBody,
    };
    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: MESSAGE_SEND_SUCCESSFUL_MESSAGE,
      contact: newMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update contacts
export async function updateContact(req: Request, res: Response) {
  const id = req.params.id as string;
  const { firstname, lastname, niche, email, message, subject, phone } =
    req.body;

  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        message: message,
        subject: subject,
        phone: phone,
        firstname: firstname,
        lastname: lastname,
        niche: niche,
      },
    });

    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      contact: existContact,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// seen message
export async function seenContact(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.contact.update({
      where: {
        id: id,
      },
      data: {
        seen: true,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete contacts
export async function deleteContact(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existContact = await Prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    if (!existContact) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteContact = await Prisma.contact.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      contact: deleteContact,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
