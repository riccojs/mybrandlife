import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import fileProtocol from "./fileProtocol.js";
import activityLog from "../middelware/activity.log.js";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_FAILED, LOG_SUCCESS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  REFERRAL_CODE_CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  BRANDSHARE_CODE_ALREADY_EXIST,
} = response;

// get all referral
export async function getAllReferral(req: Request, res: Response) {
  const { searchBy = "", type = "", sort = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;
  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = {};
  if (searchBy) {
    filter.code = {
      contains: searchBy,
      mode: "insensitive",
    };
  }

  let orderBy: any = {
    create_at: "desc",
  };

  if (sort === "old") {
    orderBy = {
      create_at: "asc",
    };
  }

  if (sort === "new") {
    orderBy = {
      create_at: "desc",
    };
  }

  if (type) {
    filter.type = type;
  }
  try {
    const referral = await Prisma.referralCode.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
      orderBy,
    });
    const totalReferral = await Prisma.referralCode.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalReferral / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        referral,
        totalPage,
        totalReferral,
        currentPage: pageNumber,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all brandshare",
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

// get all brandshare
export async function getAllReferralUser(req: Request, res: Response) {
  const { searchBy = "", code = "" } = req.query;
  const pageNumber = req.query.page
    ? parseInt(req.query.page as string, 10)
    : 1;
  const limitNumber = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 10;

  const skip = (pageNumber - 1) * limitNumber;
  let filter: any = { code: code };
  if (searchBy) {
    filter.landerName = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  try {
    const user = await Prisma.joinUser.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalUser = await Prisma.joinUser.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalUser / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        user,
        totalPage,
        totalUser,
        currentPage: pageNumber,
      },
    });
    await activityLog({
      userId: "",
      action: "Get all brandshare by user",
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

// get one referral
export async function getOneReferral(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existReferral = await Prisma.referralCode.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReferral) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      referral: existReferral,
    });
    await activityLog({
      userId: existReferral?.userId ? existReferral?.userId : "",
      action: "Get one brandshare",
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

// create referral
export async function createReferral(req: Request, res: Response) {
  const { code, type, value, active, limit, expire_in, label, link } = req.body;
  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");

    const existCode = await Prisma.referralCode.findUnique({
      where: {
        code,
      },
    });
    if (existCode) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: BRANDSHARE_CODE_ALREADY_EXIST,
      });
    }
    const newReferral = await Prisma.referralCode.create({
      data: {
        code: code,
        type: type,
        value: Number(value),
        active: active === "active" ? true : false,
        limit: Number(limit),
        expire_in: expire_in ? new Date(expire_in) : null,
        label: label,
        link: link,
        logo: profileFile ? `${basePath}${profileFile}` : null,
      },
    });
    await activityLog({
      userId: "",
      action: "Create brandshare",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: REFERRAL_CODE_CREATE_SUCCESSFUL,
      referral: newReferral,
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

// update referral
export async function updateReferral(req: Request, res: Response) {
  const id = req.params.id as string;
  const { code, type, value, active, limit, expire_in, label, link } = req.body;
  try {
    const basePath = fileProtocol(req);
    const profileFile = req.file?.filename.split(" ").join("-");

    const existReferral = await Prisma.referralCode.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReferral) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const updateReferral = await Prisma.referralCode.update({
      where: {
        id: id,
      },
      data: {
        code: code,
        type: type,
        value: Number(value),
        active: active === "active" ? true : false,
        limit: Number(limit),
        expire_in: expire_in ? new Date(expire_in) : null,
        label: label,
        link: link,
        logo: profileFile ? `${basePath}${profileFile}` : existReferral?.logo,
      },
    });
    await activityLog({
      userId: existReferral?.userId ? existReferral?.userId : "",
      action: "Update brandshare",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      referral: updateReferral,
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

// delete referral
export async function deleteReferral(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existReferral = await Prisma.referralCode.findUnique({
      where: {
        id: id,
      },
    });
    if (!existReferral) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteReferral = await Prisma.referralCode.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      referral: deleteReferral,
    });
    await activityLog({
      userId: existReferral?.userId ? existReferral?.userId : "",
      action: "Delete brandshare",
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
