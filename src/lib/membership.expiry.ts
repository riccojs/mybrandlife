import { Prisma } from "../utils/prisma.js";

/**
 * Closes every membership whose paid period has ended.
 *
 * `activate_at` holds the date the membership is paid until: the checkout
 * webhook sets it to now + 1 month (or + 12), and each renewal pushes it
 * forward. When that date has passed and the membership is still ACTIVATE,
 * it gets closed:
 *   - userMembership -> status DEACTIVATE, expired true
 *   - bpsMembership  -> status DEACTIVATE
 * A later renewal webhook sets it back to ACTIVATE.
 *
 * Safe to run as often as you like, and from more than one server: each
 * update re-checks the same conditions, so a membership renewed while the job
 * is running is never closed, and nothing is closed twice.
 */

export interface ExpiryResult {
  checkedAt: Date;
  userMemberships: { id: string; userId: string | null }[];
  bpsMemberships: { id: string; userId: string | null }[];
}

// Optional buffer so a membership isn't closed in the few minutes between the
// period ending and Stripe's renewal webhook arriving. 0 = close exactly on time.
export const graceMs = () => {
  const hours = Number(process.env.MEMBERSHIP_EXPIRY_GRACE_HOURS ?? 0);
  return Number.isFinite(hours) && hours > 0 ? hours * 60 * 60 * 1000 : 0;
};

export async function closeExpiredMemberships(
  now: Date = new Date(),
): Promise<ExpiryResult> {
  const cutoff = new Date(now.getTime() - graceMs());
  const expiredWhere = {
    status: "ACTIVATE" as const,
    activate_at: { not: null, lte: cutoff },
  };

  const [userMemberships, bpsMemberships] = await Promise.all([
    Prisma.userMembership.findMany({
      where: expiredWhere,
      select: { id: true, userId: true },
    }),
    Prisma.bpsMembership.findMany({
      where: expiredWhere,
      select: { id: true, userId: true },
    }),
  ]);

  // The where clause is repeated in the update so a row renewed between the
  // find and the update (activate_at moved forward) is left alone.
  const [closedUser, closedBps] = await Promise.all([
    userMemberships.length
      ? Prisma.userMembership.updateMany({
          where: { id: { in: userMemberships.map((m) => m.id) }, ...expiredWhere },
          data: { status: "DEACTIVATE", expired: true },
        })
      : { count: 0 },
    bpsMemberships.length
      ? Prisma.bpsMembership.updateMany({
          where: { id: { in: bpsMemberships.map((m) => m.id) }, ...expiredWhere },
          data: { status: "DEACTIVATE" },
        })
      : { count: 0 },
  ]);

  // If a row was renewed mid-run the counts differ: re-read which rows were actually closed.
  const closedIds = async <T extends { id: string }>(
    list: T[],
    count: number,
    reread: (ids: string[]) => Promise<{ id: string }[]>,
  ) => {
    if (count === list.length) return list;
    const still = new Set((await reread(list.map((m) => m.id))).map((m) => m.id));
    return list.filter((m) => still.has(m.id));
  };

  return {
    checkedAt: now,
    userMemberships: await closedIds(userMemberships, closedUser.count, (ids) =>
      Prisma.userMembership.findMany({
        where: { id: { in: ids }, status: "DEACTIVATE", expired: true },
        select: { id: true },
      }),
    ),
    bpsMemberships: await closedIds(bpsMemberships, closedBps.count, (ids) =>
      Prisma.bpsMembership.findMany({
        where: { id: { in: ids }, status: "DEACTIVATE" },
        select: { id: true },
      }),
    ),
  };
}
