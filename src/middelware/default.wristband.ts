import { Prisma } from "../utils/prisma.js";

async function defaultWristband(
  user: { id: string; landerName: string; domain: string },
  wristbandId: string,
) {
  const existWristband = await Prisma.wristband.findUnique({
    where: {
      id: wristbandId,
    },
  });
  if (existWristband) {
    await Prisma.wristbandItem.createMany({
      data: {
        wristbandId: wristbandId,
        userId: user?.id,
        title: existWristband.title,
        price: existWristband.price,
        quantity: 1,
        subTotal: 0,
        banner: existWristband.banner,
        color: existWristband.color,
        trackingNumber: `${user?.landerName}-${existWristband.color}`,
        qrCode: `https://${user?.domain}/${user?.landerName}`,
        mode: "GLOBAL",
      },
    });
  } else {
    return null;
  }
}

export default defaultWristband;
