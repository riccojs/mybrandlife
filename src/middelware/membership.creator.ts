import { Prisma } from "../utils/prisma.js";
import { MembershipType } from "../utils/types.js";

async function membershipCreator({
  user,
  planKey,
  planPrice,
  frequency,
  planOldPrice,
  session,
  status,
}: MembershipType) {
  const now = new Date();
  let activateAt;
  if (frequency === "monthly") {
    activateAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  } else {
    activateAt = new Date(
      now.getFullYear(),
      now.getMonth() + 12,
      now.getDate(),
    );
  }
  const formattedActivateAt = activateAt.toISOString().replace("Z", "+00:00");

  if (!user?.membership?.id) {
    await Prisma.userMembership.create({
      data: {
        plan: planKey,
        price: planPrice,
        duration: frequency,
        expired: false,
        oldPrice: planOldPrice,
        transactionId: session ? session.id : null,
        userId: user?.id,
        status: status ? "ACTIVATE" : "PENDING",
        activate_at: formattedActivateAt,
      },
    });
  } else {
    await Prisma.userMembership.update({
      where: {
        userId: user?.id,
      },
      data: {
        plan: planKey,
        price: planPrice,
        duration: frequency,
        expired: false,
        oldPrice: planOldPrice,
        transactionId: session ? session.id : null,
        userId: user?.id,
        status: status ? "ACTIVATE" : "PENDING",
        activate_at: formattedActivateAt,
      },
    });
  }
}

export default membershipCreator;
