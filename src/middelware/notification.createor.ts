import { Prisma } from "../utils/prisma.js";
import { getIo } from "../middelware/socket.js";
import { NotificationType } from "../utils/types.js";

async function notificationCreator({
  title,
  redirectUrl,
  profile,
  seen,
  userId,
}: NotificationType) {
  const io = getIo();
  const newNotification = await Prisma.notification.create({
    data: {
      title,
      redirectUrl,
      profile: profile ? profile : null,
      seen,
      userId: userId ? userId : null,
    },
  });
  io.emit("newNotification", newNotification);
}

export default notificationCreator;
