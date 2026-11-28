import { Request, Response } from "express";
import Stripe from "stripe";
import { Prisma } from "../../utils/prisma.js";
import status from "../../utils/status.js";
import response from "../../utils/response.js";
import activityLog from "../../middelware/activity.log.js";
import notificationCreator from "../../middelware/notification.createor.js";
import { bpsPayment } from "../../middelware/bps.payment.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const { SUCCESS_STATUS, ERROR_STATUS, LOG_SUCCESS, LOG_FAILED } = status;
const {
  QUERY_SUCCESSFUL_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
  BPS_MEMBERSHIP_CREATE_FAILED,
  BPS_MEMBERSHIP_NOT_FOUND_MESSAGE,
  BPS_MEMBERSHIP_NOT_ACTIVE_MESSAGE,
  BPS_MEMBERSHIP_ALREADY_ACTIVE_MESSAGE,
  BPS_MEMBERSHIP_ALREADY_CLOSING_MESSAGE,
  BPS_MEMBERSHIP_CLOSE_SCHEDULED_MESSAGE,
  BPS_MEMBERSHIP_CLOSED_MESSAGE,
  BPS_MEMBERSHIP_RESUMED_MESSAGE,
  BPS_MEMBERSHIP_RENEW_CHECKOUT_MESSAGE,
  BPS_MEMBERSHIP_PENDING_MESSAGE,
  BPS_SUBSCRIPTION_NOT_FOUND_MESSAGE,
} = response;

type Membership = NonNullable<
  Awaited<ReturnType<typeof Prisma.bpsMembership.findUnique>>
>;

// Stripe subscription statuses that will never bill again.
const ENDED_SUB_STATUSES = ["canceled", "incomplete_expired"];

/**
 * Finds the Stripe subscription behind a membership. Memberships created
 * before `subscriptionId` existed only have the checkout session id, so look
 * it up from the session once and save it.
 */
async function resolveSubscriptionId(m: Membership): Promise<string | null> {
  if (m.subscriptionId) return m.subscriptionId;
  if (!m.transactionId) return null;
  const session = await stripe.checkout.sessions.retrieve(m.transactionId);
  const sub = session.subscription;
  const subscriptionId = typeof sub === "string" ? sub : (sub?.id ?? null);
  if (subscriptionId) {
    await Prisma.bpsMembership.update({
      where: { id: m.id },
      data: { subscriptionId },
    });
  }
  return subscriptionId;
}

const log = (req: Request, userId: string, action: string, ok = true) =>
  activityLog({
    userId,
    action,
    status: ok ? LOG_SUCCESS : LOG_FAILED,
    endpoint: req.originalUrl,
    method: req.method,
  });

const notify = (userId: string, title: string) =>
  notificationCreator({
    title,
    redirectUrl: `/user/${userId}`,
    profile: null,
    seen: false,
    userId,
  }).catch(() => undefined); // never fail the request over a notification

const loadOwnMembership = async (req: Request, res: Response) => {
  const userId = req.auth?.id;
  if (!userId) {
    res.status(401).json({ status: ERROR_STATUS, message: UNAUTHORIZE_ERROR_MESSAGE });
    return null;
  }
  const membership = await Prisma.bpsMembership.findUnique({ where: { userId } });
  if (!membership) {
    res.status(404).json({ status: ERROR_STATUS, message: BPS_MEMBERSHIP_NOT_FOUND_MESSAGE });
    return null;
  }
  return membership;
};

const publicView = (m: Membership) => ({
  id: m.id,
  plan: m.plan,
  tier: m.tier,
  heading: m.heading,
  price: m.price,
  status: m.status,
  paidUntil: m.activate_at,
  cancelAtPeriodEnd: m.cancelAtPeriodEnd,
  canceledAt: m.canceled_at,
});

// GET /api/bps/membership: the logged-in BPS user's membership
export async function getBpsMembership(req: Request, res: Response) {
  try {
    const membership = await loadOwnMembership(req, res);
    if (!membership) return;
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: QUERY_SUCCESSFUL_MESSAGE,
      membership: publicView(membership),
    });
  } catch (error: any) {
    res.status(500).json({ status: ERROR_STATUS, message: error.message });
  }
}

/**
 * POST /api/bps/membership/close   body: { immediately?: boolean }
 *  - default: stop renewing; access continues until the paid-until date, then
 *    the hourly expiry job closes it (status DEACTIVATE).
 *  - immediately: cancel the Stripe subscription now and close right away.
 */
export async function closeBpsMembership(req: Request, res: Response) {
  const immediately = req.body?.immediately === true;
  const userId = req.auth?.id ?? "";
  try {
    const membership = await loadOwnMembership(req, res);
    if (!membership) return;
    if (membership.status !== "ACTIVATE") {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_MEMBERSHIP_NOT_ACTIVE_MESSAGE,
      });
    }
    if (membership.cancelAtPeriodEnd && !immediately) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_MEMBERSHIP_ALREADY_CLOSING_MESSAGE,
      });
    }
    const subscriptionId = await resolveSubscriptionId(membership);
    if (!subscriptionId) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_SUBSCRIPTION_NOT_FOUND_MESSAGE,
      });
    }

    const now = new Date();
    let updated: Membership;
    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId);
      updated = await Prisma.bpsMembership.update({
        where: { id: membership.id },
        data: { status: "DEACTIVATE", cancelAtPeriodEnd: false, canceled_at: now },
      });
    } else {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      updated = await Prisma.bpsMembership.update({
        where: { id: membership.id },
        data: { cancelAtPeriodEnd: true, canceled_at: now },
      });
    }

    await log(req, userId, immediately ? "BPS membership closed" : "BPS membership close scheduled");
    await notify(
      userId,
      immediately ? "BPS membership has been closed" : "BPS membership will close at the end of the period",
    );
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: immediately ? BPS_MEMBERSHIP_CLOSED_MESSAGE : BPS_MEMBERSHIP_CLOSE_SCHEDULED_MESSAGE,
      membership: publicView(updated),
    });
  } catch (error: any) {
    await log(req, userId, error.message, false);
    res.status(500).json({ status: ERROR_STATUS, message: error.message });
  }
}

/**
 * POST /api/bps/membership/renew
 *  - active but set to close: undo the close, the subscription keeps billing.
 *  - closed / expired: new Stripe checkout for the same plan; the checkout
 *    webhook re-activates it. Packages and platforms are kept.
 */
export async function renewBpsMembership(req: Request, res: Response) {
  const userId = req.auth?.id ?? "";
  try {
    const membership = await loadOwnMembership(req, res);
    if (!membership) return;

    if (membership.status === "PENDING") {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: BPS_MEMBERSHIP_PENDING_MESSAGE,
      });
    }

    // Case 1: still active, close was scheduled -> resume.
    if (membership.status === "ACTIVATE") {
      if (!membership.cancelAtPeriodEnd) {
        return res.status(400).json({
          status: ERROR_STATUS,
          message: BPS_MEMBERSHIP_ALREADY_ACTIVE_MESSAGE,
        });
      }
      const subscriptionId = await resolveSubscriptionId(membership);
      if (!subscriptionId) {
        return res.status(400).json({
          status: ERROR_STATUS,
          message: BPS_SUBSCRIPTION_NOT_FOUND_MESSAGE,
        });
      }
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      const updated = await Prisma.bpsMembership.update({
        where: { id: membership.id },
        data: { cancelAtPeriodEnd: false, canceled_at: null },
      });
      await log(req, userId, "BPS membership resumed");
      await notify(userId, "BPS membership has been renewed");
      return res.status(200).json({
        status: SUCCESS_STATUS,
        message: BPS_MEMBERSHIP_RESUMED_MESSAGE,
        renewed: true,
        membership: publicView(updated),
      });
    }

    // Case 2: closed (DEACTIVATE / SUSPEND) -> pay again.
    // Make sure the old subscription can't bill alongside the new one
    // (e.g. it was closed by the expiry job after a failed payment).
    const oldSubscriptionId = await resolveSubscriptionId(membership).catch(() => null);
    if (oldSubscriptionId) {
      const oldSub = await stripe.subscriptions.retrieve(oldSubscriptionId);
      if (!ENDED_SUB_STATUSES.includes(oldSub.status)) {
        await stripe.subscriptions.cancel(oldSubscriptionId);
      }
    }
    const session = await bpsPayment({ planKey: membership.plan, userId });
    if (!session?.pageUrl || !session.transactionId) {
      return res.status(400).json({
        status: ERROR_STATUS,
        message: session?.message ?? BPS_MEMBERSHIP_CREATE_FAILED,
      });
    }
    // The checkout webhook finds the membership by transactionId and activates it.
    await Prisma.bpsMembership.update({
      where: { id: membership.id },
      data: { transactionId: session.transactionId },
    });
    await log(req, userId, "BPS membership renew checkout created");
    res.status(200).json({
      status: SUCCESS_STATUS,
      message: BPS_MEMBERSHIP_RENEW_CHECKOUT_MESSAGE,
      renewed: false,
      pageUrl: session.pageUrl,
    });
  } catch (error: any) {
    await log(req, userId, error.message, false);
    res.status(500).json({ status: ERROR_STATUS, message: error.message });
  }
}
