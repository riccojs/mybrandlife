import Stripe from "stripe";
import { Prisma } from "../utils/prisma.js";
import { PlanWristbandType } from "../utils/types.js";
import { WristbandName } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const frontend = process.env.FRONTEND_CORS_URL;

interface UserType {
  id: string;
  username: string;
  landerName: string;
  domain: string;
  email: string;
}

async function extraWristbandPayment(
  wristbands: PlanWristbandType[],
  user: UserType,
) {
  const { id, username, landerName, domain, email } = user;
  const successUrl = `${frontend}/ordered_wristband/confirmation/{CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${frontend}/dashboard`;

  const totalAmount =
    wristbands.reduce((total, item) => total + item.subTotal, 0) ?? 0;

  if (totalAmount <= 0) {
    throw new Error("Invalid wristband amount.");
  }

  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  let customerId: string;

  if (customers.data.length) {
    customerId = customers.data[0].id;
  } else {
    const customer = await stripe.customers.create({
      email,
      name: username,
    });

    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer: customerId,
    billing_address_collection: "required",
    invoice_creation: {
      enabled: true,
    },
    customer_update: {
      address: "auto",
    },
    automatic_tax: {
      enabled: false,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(totalAmount * 100),
          product_data: {
            name: "Extra Wristbands",
            description: `${wristbands.length} wristband(s)`,
          },
        },
      },
    ],
    metadata: {
      userId: id,
      username,
      email,
      type: "EXTRA_WRISTBAND",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  await Prisma.wristbandItem.createMany({
    data: wristbands.map((item) => ({
      wristbandId: item.wristbandId,
      userId: id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      subTotal: item.subTotal,
      banner: item.banner,
      color: item.color as WristbandName,
      trackingNumber: `${landerName}-${item.color}`,
      qrCode: `https://${domain}/${landerName}`,
      mode: "EXTRA",
      transactionId: session.id,
    })),
  });

  return session.url;
}

export default extraWristbandPayment;
