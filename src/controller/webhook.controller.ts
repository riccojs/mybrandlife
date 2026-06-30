import { Request, Response } from "express";
import Stripe from "stripe";
import response from "../utils/response.js";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import webhookEmail from "../lib/webhook.email.js";
import activityLog from "../middelware/activity.log.js";
import alertEmail from "../lib/alert.email.js";
const { ERROR_STATUS, LOG_FAILED, LOG_SUCCESS } = status;
const {
  USER_ID_MISSING_IN_SUBSCRIPTION,
  CUSTOMER_HAS_BEEN_DELETED,
  CUSTOMER_ID_MISSING_ON_INVOICE,
  DATA_NOT_FOUND_MESSAGE,
} = response;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const membershipWebhookSecret = process.env.MEMBERSHIP_WEBHOOK_SECRET ?? "";
const renewalWebhookSecret = process.env.RENEW_WEBHOOK_SECRET ?? "";
const echoWebhookSecret = process.env.ECHO_WEBHOOK_SECRET ?? "";
const wristbandWebhookSecret = process.env.WRISTBAND_WEBHOOK_SECRET ?? "";

// membership webhook
export async function membershipWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      membershipWebhookSecret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const transaction = await Prisma.userMembership.findFirst({
        where: {
          transactionId: session.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const id = transaction?.id;
      const plan = transaction?.duration;
      const now = new Date();
      const userId = transaction?.userId as string;
      const existUser = await Prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const { landerName, email, discount, discountType } = existUser || {};
      let activateAt;
      if (plan === "monthly") {
        activateAt = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
        );
      } else {
        if (discountType === "MONTHLY") {
          const monthsToAdd = discount ? 12 + discount : 12;
          activateAt = new Date(
            now.getFullYear(),
            now.getMonth() + monthsToAdd,
            now.getDate(),
          );
        } else {
          activateAt = new Date(
            now.getFullYear(),
            now.getMonth() + 12,
            now.getDate(),
          );
        }
      }
      const formattedActivateAt = activateAt
        .toISOString()
        .replace("Z", "+00:00");
      await Prisma.userMembership.update({
        where: { id },
        data: {
          activate_at: formattedActivateAt,
          status: "ACTIVATE",
        },
      });
      await webhookEmail(
        landerName ?? "",
        email ?? "",
        `Your membership has been activated. Please check your user dashboard to see your selected plan. You have chosen ${plan} plan.`,
      );
      await activityLog({
        userId: userId,
        action: "Fire membership webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// renewal membership webhook
export async function renewalWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      renewalWebhookSecret,
    );
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      let existUser = null;
      const subscriptionId =
        typeof invoice.lines?.data?.[0]?.subscription === "string"
          ? invoice.lines.data[0].subscription
          : null;
      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.userId;
        if (!userId) throw new Error(USER_ID_MISSING_IN_SUBSCRIPTION);
        existUser = await Prisma.user.findUnique({
          where: { id: userId },
          include: { membership: true },
        });
      } else {
        if (typeof invoice.customer !== "string")
          throw new Error(CUSTOMER_ID_MISSING_ON_INVOICE);
        const customer = await stripe.customers.retrieve(invoice.customer);
        if ("deleted" in customer && customer.deleted)
          throw new Error(CUSTOMER_HAS_BEEN_DELETED);
        existUser = await Prisma.user.findUnique({
          where: { email: customer.email ?? "" },
          include: { membership: true },
        });
      }
      if (!existUser) throw new Error(DATA_NOT_FOUND_MESSAGE);
      const { landerName, email, frequency, planKey } = existUser;
      const baseDate = existUser.membership?.activate_at
        ? new Date(existUser.membership.activate_at) > new Date()
          ? new Date(existUser.membership.activate_at)
          : new Date()
        : new Date();
      const newExpireDate =
        frequency === "monthly"
          ? new Date(baseDate.setMonth(baseDate.getMonth() + 1))
          : new Date(baseDate.setFullYear(baseDate.getFullYear() + 1));

      await Prisma.userMembership.update({
        where: { userId: existUser.id },
        data: { activate_at: newExpireDate.toISOString(), status: "ACTIVATE" },
      });
      await webhookEmail(
        landerName ?? "",
        email ?? "",
        `Your membership has been successfully renewed. You can view the details of your selected plan in your user dashboard. You are now subscribed to the ${planKey} plan.`,
      );
      await activityLog({
        userId: existUser?.id ? existUser?.id : "",
        action: "Fire membership renewal webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({ status: ERROR_STATUS, message: error.message });
  }
}

// echo webhook
export async function echoWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, echoWebhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const transaction = await Prisma.echo.findFirst({
        where: {
          transactionId: session.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const id = transaction?.id;
      await Prisma.echo.update({
        where: {
          id: id,
        },
        data: {
          status: "PAID",
        },
      });
      await activityLog({
        userId: transaction?.userId,
        action: "Fire echo webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }
    return res.status(200).json({ received: true });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// wristband webhook
export async function wristbandWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      wristbandWebhookSecret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const transaction = await Prisma.pulsetrack.findFirst({
        where: {
          transactionId: session.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const id = transaction?.id as string;
      await Prisma.pulsetrack.update({
        where: {
          id: id,
        },
        data: {
          active: "ACTIVATE",
        },
      });
      await Prisma.wristbandItem.updateMany({
        where: {
          pulsetrackId: id,
        },
        data: {
          status: "PAID",
        },
      });
      await activityLog({
        userId: transaction?.landerId,
        action: "Fire wristband webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }
    return res.status(200).json({ received: true });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}

// Extra wristband webhook
export async function extraWristbandWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      wristbandWebhookSecret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const transaction = await Prisma.wristbandItem.findFirst({
        where: {
          transactionId: session.id,
        },
        include: {
          user: true,
        },
      });
      const findAllWristband = await Prisma.wristbandItem.findMany({
        where: {
          transactionId: session?.id,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      const { id, domain, landerName } = transaction?.user || {};

      await Prisma.wristbandItem.updateMany({
        where: {
          transactionId: session?.id,
        },
        data: {
          status: "PAID",
          paid_at: new Date(),
        },
      });
      await alertEmail(
        "New Wristband Order",
        "User Purchased Wristbands",
        `A new wristband order has been placed.
            Order Details:
            - User ID: ${id}
            - Lander Name: ${landerName}
            - Domain: ${domain}
            Wristbands:
            ${findAllWristband
              .map(
                (w) =>
                  `• ${w.title} | Qty: ${w.quantity} | Price: ${w.price} | Subtotal: ${w.subTotal}`,
              )
              .join("\n")}
            Please review the admin dashboard for full order details and fulfillment processing.`,
      );
      await activityLog({
        userId: id,
        action: "Fire wristband webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }
    return res.status(200).json({ received: true });
  } catch (error: any) {
    await activityLog({
      userId: "",
      action: error.message,
      status: LOG_FAILED,
      endpoint: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({
      status: ERROR_STATUS,
      message: error.message,
    });
  }
}
