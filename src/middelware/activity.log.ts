import { Prisma } from "../utils/prisma.js";
import { ActivityLogType } from "../utils/types.js";

async function activityLog({
  userId,
  action,
  status,
  endpoint,
  method,
}: ActivityLogType) {
  await Prisma.activityLog.create({
    data: {
      action,
      userId: userId ? userId : null,
      status,
      endpoint,
      method,
    },
  });
}

export default activityLog;
