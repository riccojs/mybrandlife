import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import activityLog from "../middelware/activity.log.js";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
} = response;

// get all notification
export async function getAllNotification(req: Request, res: Response) {
  const { searchBy = "", seenBy = "" } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  let filter: any = {};
  if (searchBy) {
    filter.userId = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  if (seenBy) {
    filter.seen = seenBy === "READ" ? true : false;
  }

  try {
    const notification = await Prisma.notification.findMany({
      skip: skip,
      take: limit,
      where: filter,
    });
    const totalNotification = await Prisma.notification.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalNotification / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        notification,
        totalPage,
        totalNotification,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all notification",
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

// get one notification
export async function getOneNotification(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existNotification = await Prisma.notification.findUnique({
      where: {
        id: id,
      },
    });
    if (!existNotification) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      notification: existNotification,
    });
    await activityLog({
      userId: existNotification?.userId ? existNotification?.userId : null,
      action: "Get one notification",
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

// seen notification
export async function seenNotification(req: Request, res: Response) {
  const { seen } = req.body;
  const id = req.params.id as string;
  try {
    const existNotification = await Prisma.notification.findUnique({
      where: {
        id: id,
      },
    });
    if (!existNotification) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        seen,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: existNotification?.id,
      action: "Seen Notification",
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

// delete notification
export async function deleteNotification(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existNotification = await Prisma.notification.findUnique({
      where: {
        id: id,
      },
    });
    if (!existNotification) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.notification.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
    });
    await activityLog({
      userId: existNotification?.userId,
      action: "Delete Notfication",
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
