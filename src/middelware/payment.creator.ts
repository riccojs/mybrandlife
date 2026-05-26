import { Prisma } from "../utils/prisma.js";
import response from "../utils/response.js";
import membershipCreator from "./membership.creator.js";
import status from "../utils/status.js";
import { UserType } from "../utils/types.js";
import Stripe from "stripe";
const { INVALID_PLAN_MESSAGE, DATA_NOT_FOUND_MESSAGE } = response;
const { ERROR_STATUS } = status;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const baseURL = process.env.FRONTEND_CORS_URL;
const testPlan = process.env.TEST_PLAN;
const myBrandLife: any = {
  SPARK_BRONZE_MONTHLY: process.env.SPARK_BRONZE_MONTHLY,
  SPARK_BRONZE_YEARLY: process.env.SPARK_BRONZE_YEARLY,
  SPARK_SILVER_MONTHLY: process.env.SPARK_SILVER_MONTHLY,
  SPARK_SILVER_YEARLY: process.env.SPARK_SILVER_YEARLY,
  SPARK_GOLD_MONTHLY: process.env.SPARK_GOLD_MONTHLY,
  SPARK_GOLD_YEARLY: process.env.SPARK_GOLD_YEARLY,
  PULSE_BRONZE_MONTHLY: process.env.PULSE_BRONZE_MONTHLY,
  PULSE_BRONZE_YEARLY: process.env.PULSE_BRONZE_YEARLY,
  PULSE_SILVER_MONTHLY: process.env.PULSE_SILVER_MONTHLY,
  PULSE_SILVER_YEARLY: process.env.PULSE_SILVER_YEARLY,
  PULSE_GOLD_MONTHLY: process.env.PULSE_GOLD_MONTHLY,
  PULSE_GOLD_YEARLY: process.env.PULSE_GOLD_YEARLY,
  POWER_SILVER_MONTHLY: process.env.POWER_SILVER_MONTHLY,
  POWER_SILVER_YEARLY: process.env.POWER_SILVER_YEARLY,
  POWER_GOLD_MONTHLY: process.env.POWER_GOLD_MONTHLY,
  POWER_GOLD_YEARLY: process.env.POWER_GOLD_YEARLY,
};

export async function paymentCreator(user: UserType, code: string) {
  const { planKey, planPrice, planOldPrice, frequency, planId, id } = user;
  const successUrl = `${baseURL}/auth/verify`;
  const failedUrl = `${baseURL}/auth/register`;
  try {
    const existUser = await Prisma.user.findUnique({
      where: { id },
      include: { membership: true },
    });
    if (!existUser) {
      throw new Error(DATA_NOT_FOUND_MESSAGE);
    }
    const { username, email } = existUser;
    // const priceId = myBrandLife[planKey];
    const priceId = testPlan;
    if (!priceId) {
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
    let promoId: string | undefined;
    if (code) {
      const promo = await stripe.promotionCodes.list({ code, active: true });
      promoId = promo.data[0]?.id;
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      discounts: promoId ? [{ promotion_code: promoId }] : [],
      success_url: successUrl,
      cancel_url: failedUrl,
      automatic_tax: { enabled: true },
      customer_update: { address: "auto" },
      subscription_data: { metadata: { userId: id, planId: planId } },
    });
    await membershipCreator({
      user: existUser,
      planKey,
      planPrice,
      frequency,
      planOldPrice,
      session: { id: session.id },
      status: false,
    });
    return { pageUrl: session.url, status: true };
  } catch (error: any) {
    return { status: ERROR_STATUS, error: error.message };
  }
}
