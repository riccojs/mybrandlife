import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  UPDATE_SUCCESSFUL_MESSAGE,
  SPIN_GROUP_CREATE_SUCCESSFUL,
} = response;

// get all groups
export async function getAllSpining(req: Request, res: Response) {
  const { searchBy = "", landerId = "" } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;
  let filter: any = {};
  if (searchBy) {
    filter.groupType = searchBy;
  }
  if (landerId) {
    filter.landerId = landerId;
  }
  try {
    const spining = await Prisma.spining.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        lander: true,
      },
    });
    const totalSpining = await Prisma.spining.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalSpining / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        spining,
        totalPage,
        totalSpining,
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
export async function getOneSpining(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existSpining = await Prisma.spining.findUnique({
      where: {
        id: id,
      },
      include: {
        lander: true,
      },
    });
    if (!existSpining) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      spining: existSpining,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// toggle spin
export async function toggleSpin(req: Request, res: Response) {
  const id = req.params.id as string;
  const { status } = req.body;
  try {
    const existTemplete = await Prisma.userTemplete.findFirst({
      where: {
        userId: id,
      },
    });
    if (!existTemplete) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }

    await Prisma.userTemplete.update({
      where: {
        id: existTemplete?.id,
      },
      data: {
        enableSpin: status,
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

// create spining
export async function createSpining(req: Request, res: Response) {
  const { landerId, groupType, title, isEnable, url } = req.body;
  try {
    const newSpining = await Prisma.spining.create({
      data: {
        landerId,
        groupType,
        isEnable,
        title,
        url,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: SPIN_GROUP_CREATE_SUCCESSFUL,
      spining: newSpining,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update spining
export async function updateSpining(req: Request, res: Response) {
  const { groupType, isEnable, title, url } = req.body;
  const id = req.params.id as string;
  try {
    const existSpining = await Prisma.spining.findUnique({
      where: {
        id: id,
      },
    });
    if (!existSpining) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spining.update({
      where: {
        id: id,
      },
      data: {
        groupType,
        isEnable,
        title,
        url,
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

// delete spining
export async function deleteSpining(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existSpining = await Prisma.spining.findUnique({
      where: {
        id: id,
      },
    });
    if (!existSpining) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spining.delete({
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
