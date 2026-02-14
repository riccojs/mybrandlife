import { Prisma } from "../utils/prisma.js";
import { ActivationStatus, MembershipStatus } from "../utils/types.js";

function calculateExpiry(
  activateAt: Date,
  duration: "monthly" | "yearly",
  status: MembershipStatus,
): Date {
  if (status !== "ACTIVE") {
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

export async function closeMembership(): Promise<void> {
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
  } catch (error: any) {
    console.error(error?.message);
  }
}
