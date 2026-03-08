import { Prisma } from "../utils/prisma.js";
import response from "../utils/response.js";
import status from "../utils/status.js";
import Stripe from "stripe";
const { DATA_NOT_FOUND_MESSAGE } = response;
const { ERROR_STATUS } = status;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const baseURL = process.env.FRONTEND_CORS_URL;

async function wristbandPayment(
  brandtapId: string,
  userId: string,
  total: number,
) {
  const successUrl = `${baseURL}/pulsetrack/orders/success/${brandtapId}`;
  const cancelUrl = `${baseURL}/pulsetrack/projects/${brandtapId}`;
  try {
    const existUser = await Prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existUser) {
      throw new Error(DATA_NOT_FOUND_MESSAGE);
    }
    const { username, email } = existUser;
    const existingCustomer = await stripe.customers.list({ email });
    const customer =
      existingCustomer.data.length > 0
        ? existingCustomer.data[0]
        : await stripe.customers.create({
            email: email ?? "",
            name: username ?? "",
          });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Brandtap Wristband Order",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        brandtapId,
        userId,
      },
    });
    return { pageUrl: session.url, status: true, transactionId: session.id };
  } catch (error: any) {
    return { status: ERROR_STATUS, error: error.message };
  }
}

export default wristbandPayment;
