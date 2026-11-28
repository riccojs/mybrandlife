import { Request, Response } from "express";
import Stripe from "stripe";
import response from "../utils/response.js";
import { Prisma } from "../utils/prisma.js";
import status from "../utils/status.js";
import webhookEmail from "../lib/webhook.email.js";
import activityLog from "../middelware/activity.log.js";
import alertEmail from "../lib/alert.email.js";
import notificationCreator from "../middelware/notification.createor.js";
const { ERROR_STATUS, LOG_FAILED, LOG_SUCCESS } = status;
const {
  USER_ID_MISSING_IN_SUBSCRIPTION,
  CUSTOMER_HAS_BEEN_DELETED,
  CUSTOMER_ID_MISSING_ON_INVOICE,
  DATA_NOT_FOUND_MESSAGE,
  TRANSACTION_NOT_FOUND_MESSAGE,
} = response;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const membershipWebhookSecret = process.env.MEMBERSHIP_WEBHOOK_SECRET ?? "";
const renewalWebhookSecret = process.env.RENEW_WEBHOOK_SECRET ?? "";
const echoWebhookSecret = process.env.ECHO_WEBHOOK_SECRET ?? "";
const wristbandWebhookSecret = process.env.WRISTBAND_WEBHOOK_SECRET ?? "";
const extraWristbandWebhookSecret =
  process.env.EXTRA_WRISTBAND_WEBHOOK_SECRET ?? "";
const bpsMembershipWebhookSecret =
  process.env.BPS_MEMBERSHIP_WEBHOOK_SECRET ?? "";
const baseURL = process.env.FRONTEND_CORS_URL;

// New paid-until date for a renewal: one period after the current paid-until
// date, or after now if that date has already passed.
export function extendPaidUntil(
  paidUntil: Date | null,
  period: "monthly" | "yearly",
  now: Date = new Date(),
): Date {
  const base =
    paidUntil && new Date(paidUntil) > now ? new Date(paidUntil) : new Date(now);
  if (period === "monthly") base.setMonth(base.getMonth() + 1);
  else base.setFullYear(base.getFullYear() + 1);
  return base;
}

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
        return res.status(404).json({ error: TRANSACTION_NOT_FOUND_MESSAGE });
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
      // The first invoice of a new subscription is already handled by the
      // checkout.session.completed webhooks. Extending here too would add an
      // extra month/year to the first period.
      if (invoice.billing_reason === "subscription_create") {
        return res.status(200).json({ received: true });
      }
      let existUser = null;
      let subscriptionMetadata: Stripe.Metadata = {};
      // Newer Stripe API versions put the subscription on invoice.parent.
      const parentSub = invoice.parent?.subscription_details?.subscription;
      const lineSub = invoice.lines?.data?.[0]?.subscription;
      const subscriptionId =
        typeof parentSub === "string"
          ? parentSub
          : typeof lineSub === "string"
            ? lineSub
            : null;
      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        subscriptionMetadata = subscription.metadata ?? {};
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

      // BPS subscriptions carry metadata.planKey (e.g. GROWTH_MONTHLY); main
      // subscriptions carry metadata.planId. Renew the BPS membership too, or
      // the expiry job would close paying BPS customers after one period.
      const bpsPlanKey = subscriptionMetadata.planKey;
      if (bpsPlanKey) {
        const bps = await Prisma.bpsMembership.findUnique({
          where: { userId: existUser.id },
        });
        if (bps) {
          const bpsNewExpire = extendPaidUntil(
            bps.activate_at,
            bpsPlanKey.toUpperCase().endsWith("_MONTHLY") ? "monthly" : "yearly",
          );
          await Prisma.bpsMembership.update({
            where: { id: bps.id },
            data: { activate_at: bpsNewExpire, status: "ACTIVATE" },
          });
        }
      }

      if (existUser.membership) {
        const newExpireDate = extendPaidUntil(
          existUser.membership.activate_at,
          frequency === "monthly" ? "monthly" : "yearly",
        );
        await Prisma.userMembership.update({
          where: { userId: existUser.id },
          data: {
            activate_at: newExpireDate,
            status: "ACTIVATE",
            expired: false, // re-open a membership the expiry job had closed
          },
        });
      }
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
        return res.status(404).json({ error: TRANSACTION_NOT_FOUND_MESSAGE });
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
export async function pulsetrackwristbandWebhook(req: Request, res: Response) {
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
        include: {
          lander: true,
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: TRANSACTION_NOT_FOUND_MESSAGE });
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
      await notificationCreator({
        title: `${transaction?.lander?.landerName} has successfully paid for the pulsetrack wristband.`,
        redirectUrl: `${baseURL}/pulsetrack/orders/success/${id}`,
        profile: transaction?.lander?.profile
          ? transaction?.lander?.profile
          : null,
        seen: false,
        userId: id,
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
      extraWristbandWebhookSecret,
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
        return res.status(404).json({ error: TRANSACTION_NOT_FOUND_MESSAGE });
      }
      const { id, domain, landerName, profile } = transaction?.user || {};

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
      await notificationCreator({
        title: `${landerName} has successfully paid for the extra wristband.`,
        redirectUrl: `/ordered_wristband/confirmation/${session.id}`,
        profile: profile ? profile : null,
        seen: false,
        userId: id,
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

// bps membership webhook
export async function bpsMembershipWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      bpsMembershipWebhookSecret,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const transaction = await Prisma.bpsMembership.findFirst({
        where: {
          transactionId: session.id,
        },
        include: {
          user: {
            include: {
              membership: true,
            },
          },
        },
      });

      if (!transaction) {
        return res.status(404).json({ error: TRANSACTION_NOT_FOUND_MESSAGE });
      }
      if (!transaction?.user) {
        return res.status(404).json({ error: DATA_NOT_FOUND_MESSAGE });
      }
      const id = transaction?.id;
      const userId = transaction?.userId ?? "";

      const now = new Date();
      const { tier, plan } = transaction || {};
      const { landerName, email, status } = transaction?.user;

      // plan is the Stripe plan key, e.g. BASIC_MONTHLY / BASIC_YEARLY.
      let activateAt;
      if (plan?.toUpperCase().endsWith("_MONTHLY")) {
        activateAt = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
        );
      } else {
        activateAt = new Date(
          now.getFullYear(),
          now.getMonth() + 12,
          now.getDate(),
        );
      }

      const formattedActivateAt = activateAt
        .toISOString()
        .replace("Z", "+00:00");
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : (session.subscription?.id ?? null);
      await Prisma.bpsMembership.update({
        where: { id },
        data: {
          activate_at: formattedActivateAt,
          status: "ACTIVATE",
          // new (or renewed) subscription: remember it, clear any old close request
          subscriptionId,
          cancelAtPeriodEnd: false,
          canceled_at: null,
        },
      });
      if (status === "PENDING") {
        await Prisma.user.update({
          where: { id: userId },
          data: {
            status: "ACTIVATE",
          },
        });
        if (transaction.user.membership?.id) {
          await Prisma.userMembership.update({
            where: { id: transaction.user.membership.id },
            data: {
              status: "ACTIVATE",
              activate_at: formattedActivateAt,
            },
          });
        }
      }
      await webhookEmail(
        landerName ?? "",
        email ?? "",
        `Your BPS membership has been activated. Please check your user dashboard to see your selected plan. You have chosen ${tier} plan.`,
      );
      await activityLog({
        userId: userId,
        action: "Fire bps membership webhook",
        status: LOG_SUCCESS,
        endpoint: req.originalUrl,
        method: req.method,
      });
    }

    // Keep the membership in sync when the subscription is changed in Stripe
    // itself (customer portal, dashboard, or Stripe giving up on failed payments).
    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      // Only the membership's *current* subscription counts: an old one ending
      // after a renewal must not close the new one. Unknown ids (e.g. main
      // memberships) are ignored.
      const membership = await Prisma.bpsMembership.findFirst({
        where: { subscriptionId: sub.id },
      });
      if (membership) {
        if (event.type === "customer.subscription.deleted") {
          if (membership.status === "ACTIVATE") {
            await Prisma.bpsMembership.update({
              where: { id: membership.id },
              data: {
                status: "DEACTIVATE",
                cancelAtPeriodEnd: false,
                canceled_at: membership.canceled_at ?? new Date(),
              },
            });
          }
        } else {
          const closing = Boolean(sub.cancel_at_period_end || sub.cancel_at);
          if (closing !== membership.cancelAtPeriodEnd) {
            await Prisma.bpsMembership.update({
              where: { id: membership.id },
              data: {
                cancelAtPeriodEnd: closing,
                canceled_at: closing ? (membership.canceled_at ?? new Date()) : null,
              },
            });
          }
        }
        await activityLog({
          userId: membership.userId ?? "",
          action: `BPS subscription ${event.type.split(".").pop()}`,
          status: LOG_SUCCESS,
          endpoint: req.originalUrl,
          method: req.method,
        });
      }
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
