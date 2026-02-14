import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import ShippingEmail from "../lib/shipping.email.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  ORDER_NOT_FOUND_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
} = response;

// get all wistband
export async function getAllWistband(req: Request, res: Response) {
  const { userId = "", orderId = "", statusBy = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {};
  if (orderId) {
    filter.orderId = Number(orderId);
  }
  if (userId) {
    filter.userId = userId;
  }
  if (statusBy) {
    filter.shipping = statusBy;
  }
  try {
    const wistband = await Prisma.wisetband.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
      include: {
        wisetbandItem: true,
        user: true,
      },
    });
    const totalWistband = await Prisma.wisetband.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalWistband / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        wistband,
        totalPage,
        totalWistband,
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

// get one wistband
export async function getOneWistband(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWistband = await Prisma.wisetband.findUnique({
      where: {
        id: id,
      },
      include: {
        wisetbandItem: true,
        user: true,
      },
    });
    if (!existWistband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      wistband: existWistband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one wistband by orderId
export async function getOneWistbandByOrderId(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWistband = await Prisma.wisetband.findUnique({
      where: {
        orderId: Number(id),
      },
      include: {
        wisetbandItem: true,
        user: true,
      },
    });
    if (!existWistband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: ORDER_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      wistband: existWistband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update wistband status
export async function updateWisetbandStatus(req: Request, res: Response) {
  const id = req.params.id as string;
  const { shipping } = req.body;
  try {
    const existWisetband = await Prisma.wisetband.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existWisetband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updatePartner = await Prisma.wisetband.update({
      where: {
        id: id,
      },
      data: {
        shipping: shipping,
      },
    });
    const { firstName, lastName, email, phone } = existWisetband?.user;
    await ShippingEmail(
      email,
      firstName ?? "",
      lastName ?? "",
      phone ?? "",
      id,
      shipping,
    );
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      wistband: updatePartner,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete wistband
export async function deleteWistband(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existWistband = await Prisma.wisetband.findUnique({
      where: {
        id: id,
      },
    });
    if (!existWistband) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteWistband = await Prisma.wisetband.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      wistband: deleteWistband,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
