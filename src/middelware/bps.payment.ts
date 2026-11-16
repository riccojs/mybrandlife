import { Prisma } from "../utils/prisma.js";
import response from "../utils/response.js";
import status from "../utils/status.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const bpsPlans: any = {
  BASIC_MONTHLY: process.env.BASIC_MONTHLY,
  BASIC_YEARLY: process.env.BASIC_YEARLY,
  STARTER_MONTHLY: process.env.STARTER_MONTHLY,
  STARTER_YEARLY: process.env.STARTER_YEARLY,
  GROWTH_MONTHLY: process.env.GROWTH_MONTHLY,
  GROWTH_YEARLY: process.env.GROWTH_YEARLY,
  PRO_MONTHLY: process.env.PRO_MONTHLY,
  PRO_YEARLY: process.env.PRO_YEARLY,
  ENTERPRISE_MONTHLY: process.env.ENTERPRISE_MONTHLY,
  ENTERPRISE_YEARLY: process.env.ENTERPRISE_YEARLY,
};

const { INVALID_PLAN_MESSAGE, DATA_NOT_FOUND_MESSAGE } = response;
const { ERROR_STATUS } = status;
const bpsURL = process.env.BPS_CORS_URL;

interface DataType {
  planKey: string;
  userId: string;
}

export async function bpsPayment({ planKey, userId }: DataType) {
  const successUrl = `https://mybrandlife.me/auth/verify`;
  const failedUrl = `https://mybrandlife.me/pricing`;

  try {
    const existUser = await Prisma.user.findUnique({
      where: { id: userId },
      include: { membership: true },
    });
    if (!existUser) {
      throw new Error(DATA_NOT_FOUND_MESSAGE);
    }
    const { username, email } = existUser;
    const price = bpsPlans[planKey];
    if (!price) {
      return { pageUrl: "", message: INVALID_PLAN_MESSAGE };
    }

    const existingCustomer = await stripe.customers.list({ email });
    let customer: Stripe.Customer;
    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email ?? "",
        name: username ?? "",
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: failedUrl,
      customer_update: { address: "auto" },
      subscription_data: { metadata: { userId: userId, planKey: planKey } },
    });
    return { pageUrl: session.url, status: true, transactionId: session.id };
  } catch (error: any) {
    return { status: ERROR_STATUS, error: error.message };
  }
}
