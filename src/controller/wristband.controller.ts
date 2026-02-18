import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import ShippingEmail from "../lib/shipping.email.js";
import fileProtocol from "./fileProtocol.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  ORDER_NOT_FOUND_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  WRISTBAND_CREATE_SUCCESSFUL,
} = response;

// get all wristband
export async function getAllWristband(req: Request, res: Response) {
  const { statusBy = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {};
  if (statusBy) {
    filter.status = statusBy;
  }
  try {
    const wristband = await Prisma.wristband.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalWristband = await Prisma.wristband.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalWristband / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        wristband,
        totalPage,
        totalWristband,
        currentPage: pageNumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one wristband
export async function getOneWristband(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristband.findUnique({
      where: {
        id: id,
      },
    });
    if (!existWristband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      wistband: existWristband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create wristband
export async function createWristband(req: Request, res: Response) {
  const { title, description, price, quantity, color, stock } = req.body;
  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    const newWristband = await Prisma.wristband.create({
      data: {
        title: title,
        description: description,
        price: Number(price),
        quantity: Number(quantity),
        color: color,
        stock: Number(stock),
        status: "DRAFT",
        banner: `${basePath}${profileFile}`,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: WRISTBAND_CREATE_SUCCESSFUL,
      wristband: newWristband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update wristband
export async function updateWristband(req: Request, res: Response) {
  const { title, description, price, quantity, color, stock } = req.body;
  const id = req.params.id as string;

  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    await Prisma.wristband.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        price: Number(price),
        quantity: Number(quantity),
        color: color,
        stock: Number(stock),
        status: "DRAFT",
        banner: `${basePath}${profileFile}`,
      },
    });
    res.status(201).json({
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

// delete wristband
export async function deleteWristband(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristband.findUnique({
      where: {
        id: id,
      },
    });
    if (!existWristband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.wristband.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create plan wristband
export async function createPlanWristband(req: Request, res: Response) {
  const {
    wristbandId,
    userId,
    title,
    description,
    price,
    quantity,
    color,
    banner,
    subTotal,
  } = req.body;
  try {
    const newWristband = await Prisma.planWristband.create({
      data: {
        wristbandId: wristbandId,
        userId: userId,
        title: title,
        description: description,
        price: Number(price),
        quantity: Number(quantity),
        color: color,
        status: "INPRODUCTION",
        banner: banner,
        subTotal: Number(subTotal),
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: WRISTBAND_CREATE_SUCCESSFUL,
      wristband: newWristband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
