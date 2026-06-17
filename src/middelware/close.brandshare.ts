import { Prisma } from "../utils/prisma.js";

export const closeBrandshare = async () => {
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
  } catch (error) {
    console.error("[Referral Cron Error]", error);
  }
};
