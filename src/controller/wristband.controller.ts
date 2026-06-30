import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import ShippingEmail from "../lib/shipping.email.js";
import fileProtocol from "./fileProtocol.js";
import activityLog from "../middelware/activity.log.js";
import { WristbandMode } from "@prisma/client";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  WRISTBAND_CREATE_SUCCESSFUL,
} = response;

// get all wristband
export async function getAllWristband(req: Request, res: Response) {
  const { statusBy = "", searchBy = "" } = req.query;
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
  if (searchBy) {
    filter.title = {
      contains: searchBy,
      mode: "insensitive",
    };
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
    await activityLog({
      userId: "",
      action: "Get all wristband",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get all wristband
export async function getAllWristbandItem(req: Request, res: Response) {
  const {
    statusBy = "",
    userId = "",
    modeBy = "",
    searchBy = "",
    pulsetrackId = "",
  } = req.query;
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
  if (userId) {
    filter.userId = userId;
  }
  if (modeBy) {
    filter.mode = modeBy;
  }
  if (pulsetrackId) {
    filter.pulsetrackId = pulsetrackId;
  }
  if (searchBy) {
    filter.title = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  try {
    const wristband = await Prisma.wristbandItem.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalWristband = await Prisma.wristbandItem.count({
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
    await activityLog({
      userId: "",
      action: "Get all wristband item",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get all wristband
export async function getAllWristbandItemByMode(req: Request, res: Response) {
  const { statusBy = "", userId = "", searchBy = "", modeBy = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {
    mode: {
      in: [WristbandMode.GLOBAL, WristbandMode.EXTRA],
    },
  };
  if (statusBy) {
    filter.status = statusBy;
  }
  if (userId) {
    filter.userId = userId;
  }
  if (modeBy) {
    filter.mode = modeBy;
  }
  if (searchBy) {
    filter.title = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  try {
    const wristband = await Prisma.wristbandItem.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
      include: {
        user: true,
      },
    });
    const totalWristband = await Prisma.wristbandItem.count({
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
    await activityLog({
      userId: "",
      action: "Get all wristband item",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

export async function getAllOrderedWristband(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristbandItem.findMany({
      where: {
        transactionId: id,
        mode: "EXTRA",
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
      wristband: existWristband,
    });
    await activityLog({
      userId: "",
      action: "Get all ordered wristband item",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one wristband
export async function getOneWristbandItem(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristbandItem.findFirst({
      where: {
        trackingNumber: id,
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
    await activityLog({
      userId: existWristband?.userId,
      action: "Get one wristband item",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one wristband by id
export async function getOneWristbandItemById(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristbandItem.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
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
      wristband: existWristband,
    });
    await activityLog({
      userId: existWristband?.userId,
      action: "Get one wristband item by id",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
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
      wristband: existWristband,
    });
    await activityLog({
      userId: "",
      action: "Get one wristband",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create wristband
export async function createWristband(req: Request, res: Response) {
  const { title, description, price, status, color, stock } = req.body;
  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");
    const newWristband = await Prisma.wristband.create({
      data: {
        title: title,
        description: description,
        price: Number(price),
        color: color,
        stock: Number(stock),
        status: status,
        banner: `${basePath}${profileFile}`,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: WRISTBAND_CREATE_SUCCESSFUL,
      wristband: newWristband,
    });
    await activityLog({
      userId: "",
      action: "Create wristband",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update wristband
export async function updateWristband(req: Request, res: Response) {
  const { title, description, price, color, stock, status } = req.body;
  const id = req.params.id as string;

  try {
    const existWristband = await Prisma.wristband.findUnique({
      where: {
        id: id,
      },
    });
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
        color: color,
        stock: Number(stock),
        status: status,
        banner: profileFile
          ? `${basePath}${profileFile}`
          : existWristband?.banner,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: "",
      action: "Update wristband",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
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
    await activityLog({
      userId: "",
      action: "Delete wristband",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete wristband
export async function deleteWristbandItem(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWristband = await Prisma.wristbandItem.findUnique({
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
    await Prisma.wristbandItem.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existWristband?.userId,
      action: "Delete wristband item",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create plan wristband
export async function updateWristbandItemStatus(req: Request, res: Response) {
  const { status } = req.body;
  const id = req.params.id as string;

  try {
    const existOrder = await Prisma.wristbandItem.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existOrder) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const { email, firstName, lastName, phone } = existOrder?.user;

    const statusConfig = {
      SHIPPED: {
        dateField: "shipped_at",
        emailStatus: "SHIPPED",
      },
      DELIVERED: {
        dateField: "delivered_at",
        emailStatus: "DELIVERED",
      },
      COMPLETE: {
        dateField: "complete_at",
        emailStatus: "COMPLETE",
      },
      INPRODUCTION: {
        dateField: "inproduction_at",
        emailStatus: "INPRODUCTION",
      },
      CANCELED: {
        dateField: "cancel_at",
        emailStatus: "CANCELED",
      },
      REFUNDED: {
        dateField: "refund_at",
        emailStatus: "REFUNDED",
      },
      DISABLED: {
        dateField: "disable_at",
        emailStatus: "DISABLED",
      },
      PAID: {
        dateField: "paid_at",
        emailStatus: "PAID",
      },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    await Prisma.wristbandItem.update({
      where: {
        id,
      },
      data: {
        status,
        [config.dateField]: new Date(),
      },
    });
    await ShippingEmail(
      email,
      firstName,
      lastName,
      `${phone}`,
      existOrder?.trackingNumber ?? "",
      config.emailStatus,
    );
    await activityLog({
      userId: existOrder?.userId,
      action: "Update wristband item status",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
