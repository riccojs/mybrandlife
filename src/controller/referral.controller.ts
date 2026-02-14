import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  REFERRAL_CODE_CREATE_SUCCESSFUL,
  UPDATE_SUCCESSFUL_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} = response;

// get all referral
export async function getAllReferral(req: Request, res: Response) {
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
    filter.code = {
      contains: searchBy,
      mode: "insensitive",
    };
  }
  try {
    const referral = await Prisma.referralCode.findMany({
      skip: skip,
      take: limitNumber,
      where: filter,
    });
    const totalReffal = await Prisma.referralCode.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalReffal / limitNumber);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        referral,
        totalPage,
        totalReffal,
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// create referral
export async function createReferral(req: Request, res: Response) {
  const { code, type, value, active } = req.body;
  try {
    const newReferral = await Prisma.referralCode.create({
      data: {
        code: code,
        type: type,
        value: Number(value),
        active: active,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: REFERRAL_CODE_CREATE_SUCCESSFUL,
      referral: newReferral,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update referral
export async function updateReferral(req: Request, res: Response) {
  const id = req.params.id as string;
  const { code, type, value, joined, active } = req.body;
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
    const updateReferral = await Prisma.referralCode.update({
      where: {
        id: id,
      },
      data: {
        code: code,
        type: type,
        value: Number(value),
        joined: Number(joined),
        active: active,
      },
    });
    return res.status(201).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      referral: updateReferral,
    });
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
