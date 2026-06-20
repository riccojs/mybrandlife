import { Request, Response } from "express";
import { ActivationStatus } from "@prisma/client";
import { Prisma } from "../utils/prisma.js";
import { MembershipStatus } from "../utils/types.js";
import status from "../utils/status.js";
import response from "../utils/response.js";
const { SUCCESS_STATUS, ERROR_STATUS } = status;
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
  } catch (error: any) {
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
};

// expired brandshare
export async function expiredMembership(req: Request, res: Response) {
  try {
    const memberships = await Prisma.userMembership.findMany({
      where: { expired: false },
    });
    const now = new Date();
    for (const membership of memberships) {
      if (
        !membership.activate_at ||
        !membership.duration ||
        !membership.status
      ) {
        continue;
      }
      const expiryDate = calculateExpiry(
        membership.activate_at,
        membership.duration as "monthly" | "yearly",
        membership.status as MembershipStatus,
      );
      if (expiryDate <= now) {
        await Prisma.userMembership.update({
          where: { id: membership.id },
          data: { expired: true, status: "EXPIRED" as ActivationStatus },
        });
      }
    }
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

// delete activity log
export const deleteActivityLog = async (req: Request, res: Response) => {
  try {
    await Prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
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
};

// helper membsership
function calculateExpiry(
  activateAt: Date,
  duration: "monthly" | "yearly",
  status: MembershipStatus,
): Date {
  if (status !== "ACTIVATE") {
    throw new Error("Membership is not active");
  }
  const start = new Date(activateAt);
  if (duration === "monthly") {
    return new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
  }
  if (duration === "yearly") {
    return new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  }
  throw new Error("Invalid membership duration");
}
