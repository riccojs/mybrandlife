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
  DUPLICAT_GROUP_MESSAGE,
  SPIN_GROUP_CREATE_SUCCESSFUL,
} = response;

// get all groups
export async function getAllGroup(req: Request, res: Response) {
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
    const group = await Prisma.spiningGroup.findMany({
      skip: skip,
      take: limit,
      where: filter,
      include: {
        spiningItems: true,
      },
    });
    const totalGroup = await Prisma.spiningGroup.count({
      where: filter,
    });
    const totalPage = Math.ceil(totalGroup / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        group,
        totalPage,
        totalGroup,
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
export async function getOneGroup(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existGroup = await Prisma.spiningGroup.findUnique({
      where: {
        id: id,
      },
      include: {
        spiningItems: true,
      },
    });
    if (!existGroup) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      group: existGroup,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// get one contacts
export async function getOneGroupItem(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existGroupItem = await Prisma.spiningItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!existGroupItem) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      groupItem: existGroupItem,
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

// create spining group
export async function createGroup(req: Request, res: Response) {
  const { landerId, groupType, isEnable } = req.body;
  try {
    const existGroup = await Prisma.spiningGroup.findUnique({
      where: {
        groupType,
        landerId,
      },
    });
    if (existGroup) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: DUPLICAT_GROUP_MESSAGE,
      });
    }
    const newGroup = await Prisma.spiningGroup.create({
      data: {
        landerId,
        groupType,
        isEnable,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: SPIN_GROUP_CREATE_SUCCESSFUL,
      group: newGroup,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update spining group
export async function updateGroup(req: Request, res: Response) {
  const { groupType, isEnable } = req.body;
  const id = req.params.id as string;
  try {
    const existGroup = await Prisma.spiningGroup.findUnique({
      where: {
        id: id,
      },
    });
    if (!existGroup) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spiningGroup.update({
      where: {
        id: id,
      },
      data: {
        groupType,
        isEnable,
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

// assign spining group item
export async function assignGroupItem(req: Request, res: Response) {
  const { groupId, name, url } = req.body;
  try {
    const existGroup = await Prisma.spiningGroup.findUnique({
      where: {
        id: groupId,
      },
    });
    if (!existGroup) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const newItem = await Prisma.spiningItem.create({
      data: {
        groupId,
        name,
        url,
      },
    });
    res.status(201).json({
      status: SUCCESS_STATUS,
      message: SPIN_GROUP_CREATE_SUCCESSFUL,
      groupItem: newItem,
      group: existGroup,
    });
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// update spining group item
export async function updateGroupItem(req: Request, res: Response) {
  const { name, url } = req.body;
  const id = req.params.id as string;
  try {
    const existGroupItem = await Prisma.spiningItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!existGroupItem) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spiningItem.update({
      where: {
        id: id,
      },
      data: {
        name,
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

// delete group
export async function deleteGroup(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existGroup = await Prisma.spiningGroup.findUnique({
      where: {
        id: id,
      },
    });
    if (!existGroup) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spiningGroup.delete({
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

// delete group Item
export async function deleteGroupItem(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existGroupItem = await Prisma.spiningItem.findUnique({
      where: {
        id: id,
      },
    });
    if (!existGroupItem) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    await Prisma.spiningItem.delete({
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
