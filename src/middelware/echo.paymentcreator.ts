import { Prisma } from "../utils/prisma.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function echoPaymentcreator(
  amount: number,
  userId: string,
  name: string,
  landerName: string,
  domain: string,
) {
  const getUrl = process.env.CORS_ORIGIN;
  const splitUrl = getUrl?.split(",");
  const mainDomain = splitUrl?.[0];
  const successUrl = `${mainDomain}/payment/success/${landerName}`;
  const failedUrl = `https://${domain}/${landerName}`;
  const existUser = await Prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const { username, email, stripeAccountId } = existUser || {};
  const existUsername = username ? username : "";
  const existEmail = email ? email : "";
  const existstripeAccountId = stripeAccountId ? stripeAccountId : "";
  const existingCustomer = await stripe.customers.list(
    { email: existEmail },
    { stripeAccount: existstripeAccountId },
  );
  let customer;
  if (existingCustomer.data.length > 0) {
    customer = existingCustomer.data[0];
  } else {
    customer = await stripe.customers.create(
      { email: existEmail, name: existUsername },
      { stripeAccount: existstripeAccountId },
    );
  }
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      customer: customer.id,
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      invoice_creation: { enabled: true },
      customer_update: {
        address: "auto",
      },
      automatic_tax: { enabled: false },
      success_url: successUrl,
      cancel_url: failedUrl,
      metadata: {
        userId: userId,
        username: existUsername,
        email: existEmail,
      },
    },
    {
      stripeAccount: existstripeAccountId,
    },
  );
  const data = {
    pageUrl: session.url,
    transactionId: session.id,
  };
  return data;
}

export default echoPaymentcreator;
