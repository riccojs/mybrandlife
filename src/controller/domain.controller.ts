import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import activityLog from "../middelware/activity.log.js";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;

// get all domain
export async function getAllDomain(req: Request, res: Response) {
  const { searchBy = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {};
  if (searchBy) {
    filter.domain = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  try {
    const domain = await Prisma.domainReq.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalDomain = await Prisma.domainReq.count({ where: filter });
    const totalPage = Math.ceil(totalDomain / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        domain,
        totalPage,
        totalDomain,
        currentPage: pageNumber,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all domain",
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

// get one domain
export async function getOneDomain(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existDomain = await Prisma.domainReq.findUnique({
      where: {
        id: id,
      },
    });
    if (!existDomain) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      domain: existDomain,
    });
    await activityLog({
      userId: "",
      action: "Get one domain",
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

// update domain
export async function deleteDomain(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existDomain = await Prisma.domainReq.findUnique({
      where: {
        id: id,
      },
    });
    if (!existDomain) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.domainReq.delete({
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
      action: "Delete domain",
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
