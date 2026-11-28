import { Request, Response } from "express";
import { Prisma } from "../utils/prisma.js";
import { runMembershipExpiry } from "../lib/membership.scheduler.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
import activityLog from "../middelware/activity.log.js";
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const { UPDATE_SUCCESSFUL_MESSAGE } = response;

// expired brandshare
export const expiredBrandshare = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    await Prisma.referralCode.updateMany({
      where: {
        active: true,
        expire_in: {
          not: null,
          lte: now,
        },
      },
      data: {
        active: false,
      },
    });
    const referralCodes = await Prisma.referralCode.findMany({
      where: {
        active: true,
        limit: {
          not: null,
        },
      },
      include: {
        _count: {
          select: {
            joinUsers: true,
          },
        },
      },
    });
    const expiredIds = referralCodes
      .filter(
        (code) => code.limit !== null && code._count.joinUsers >= code.limit,
      )
      .map((code) => code.id);
    if (expiredIds.length > 0) {
      await Prisma.referralCode.updateMany({
        where: {
          id: {
            in: expiredIds,
          },
        },
        data: {
          active: false,
        },
      });
    }
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: "",
      action: "Expired all brandshare code",
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
};

// expired membership: same job the in-process scheduler runs (lib/membership.scheduler.ts)
export async function expiredMembership(req: Request, res: Response) {
  try {
    const result = await runMembershipExpiry();
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
      skipped: result === null, // a run was already in progress
      closed: {
        memberships: result?.userMemberships.length ?? 0,
        bpsMemberships: result?.bpsMemberships.length ?? 0,
      },
    });
  } catch (error: any) {
    // runMembershipExpiry already wrote the failure to the activity log.
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// delete activity log
export const deleteActivityLog = async (req: Request, res: Response) => {
  try {
    await Prisma.activityLog.deleteMany({
      where: {
        create_at: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: UPDATE_SUCCESSFUL_MESSAGE,
    });
    await activityLog({
      userId: "",
      action: "Delete activity logs",
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
};

