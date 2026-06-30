import { Prisma } from "../utils/prisma.js";

async function defaultWristband(user: {
  id: string;
  landerName: string;
  domain: string;
}) {
  const existWristband = await Prisma.wristband.findFirst({
    where: {
      color: "BLACK",
    },
  });
  const wristbandId = existWristband?.id ?? "";
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
