import { Request, Response } from "express";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import activityLog from "../../middelware/activity.log.js";
import notificationCreator from "../../middelware/notification.createor.js";
import bpsDeactivateEmail from "../../lib/bps.deactivate.emal.js";

const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  DATA_NOT_FOUND_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  QUERY_SUCCESSFUL_MESSAGE,
} = response;

export async function getAllBpsUser(req: Request, res: Response) {
  const { searchBy, statusBy } = req.query;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * page;
  const filter: any = {
    bpsMembership: {
      isNot: null,
    },
  };
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
    const [users, totalUser] = await Promise.all([
      Prisma.user.findMany({
        skip,
        take: limit,
        where: filter,
        include: {
          bpsMembership: true,
        },
        orderBy: {
          create_at: "desc",
        },
      }),
      Prisma.user.count({
        where: filter,
      }),
    ]);
    const totalPage = Math.ceil(totalUser / limit);
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      data: {
        user: users,
        totalPage,
        totalUser,
        currentPage: page,
      },
    });
    await activityLog({
      userId: "",
      action: "Get All Bps User",
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

// get one bps user
export async function getOneBpsUser(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existUser = await Prisma.user.findUnique({
      where: {
        id: id,
        bpsMembership: {
          isNot: null,
        },
      },
      include: {
        bpsMembership: true,
      },
    });
    if (!existUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      user: existUser,
    });
    await activityLog({
      userId: id,
      action: "Get One Bps User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
  } catch (error: any) {
    await activityLog({
      userId: id,
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

// delete bps user membership
export async function deleteBpsUserMembership(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const existBpsUser = await Prisma.bpsMembership.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });
    if (!existBpsUser) {
      return res.status(404).json({
        status: ERROR_STATUS,
        message: DATA_NOT_FOUND_MESSAGE,
      });
    }
    const deleteUser = await Prisma.bpsMembership.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: DELETE_SUCCESS_MESSAGE,
      user: deleteUser,
    });
    await activityLog({
      userId: existBpsUser?.user?.id ? existBpsUser?.user?.id : null,
      action: "Delete User",
      status: LOG_SUCCESS,
      endpoint: req.originalUrl,
      method: req.method,
    });
    const { landerName, email, profile } = existBpsUser?.user as {
      landerName: string;
      email: string;
      profile: string;
    };
    await bpsDeactivateEmail(landerName, email);
    await notificationCreator({
      title: `${landerName} account has been deleted`,
      redirectUrl: "/bps/user",
      profile: profile,
      seen: false,
      userId: existBpsUser?.user?.id ? existBpsUser?.user?.id : null,
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
