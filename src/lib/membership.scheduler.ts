import cron from "node-cron";
import { closeExpiredMemberships, ExpiryResult } from "./membership.expiry.js";
import activityLog from "../middelware/activity.log.js";
import notificationCreator from "../middelware/notification.createor.js";
import status from "../utils/status.js";
const { LOG_SUCCESS, LOG_FAILED } = status;

const ENDPOINT = "cron:membership-expiry";
let running = false;

/** Runs the expiry once, then logs and notifies for every membership it closed. */
export async function runMembershipExpiry(
  now: Date = new Date(),
): Promise<ExpiryResult | null> {
  if (running) return null; // the previous run is still going
  running = true;
  try {
    const result = await closeExpiredMemberships(now);
    const closed = [
      ...result.userMemberships.map((m) => ({ ...m, kind: "Membership" })),
      ...result.bpsMemberships.map((m) => ({ ...m, kind: "BPS membership" })),
    ];
    for (const m of closed) {
      await activityLog({
        userId: m.userId ?? "",
        action: `${m.kind} expired and closed (${m.id})`,
        status: LOG_SUCCESS,
        endpoint: ENDPOINT,
        method: "CRON",
      });
      // A failed notification (e.g. socket not up) must not stop the other closings.
      await notificationCreator({
        title: `${m.kind} has expired and been closed`,
        redirectUrl: `/user/${m.userId ?? ""}`,
        profile: null,
        seen: false,
        userId: m.userId ?? "",
      }).catch(() => undefined);
    }
    if (closed.length) {
      console.log(
        `[membership-expiry] closed ${result.userMemberships.length} membership(s), ${result.bpsMemberships.length} BPS membership(s)`,
      );
    }
    return result;
  } catch (error: any) {
    console.error("[membership-expiry] failed:", error.message);
    await activityLog({
      userId: "",
      action: `Membership expiry failed: ${error.message}`,
      status: LOG_FAILED,
      endpoint: ENDPOINT,
      method: "CRON",
    }).catch(() => undefined);
    throw error;
  } finally {
    running = false;
  }
}

/**
 * Starts the in-process schedule. Env:
 *   MEMBERSHIP_EXPIRY_CRON  cron expression, default "0 * * * *" (every hour).
 *                           Set to "off" to disable (e.g. if an external
 *                           scheduler calls POST /api/corn/expired-membership).
 * Also runs once on startup so nothing waits a full interval after a deploy.
 */
export function startMembershipExpiryScheduler() {
  const expression = process.env.MEMBERSHIP_EXPIRY_CRON ?? "0 * * * *";
  if (expression.toLowerCase() === "off") return null;
  if (!cron.validate(expression)) {
    console.error(`[membership-expiry] invalid MEMBERSHIP_EXPIRY_CRON "${expression}", scheduler not started`);
    return null;
  }
  const task = cron.schedule(expression, () => {
    runMembershipExpiry().catch(() => undefined);
  });
  runMembershipExpiry().catch(() => undefined);
  console.log(`[membership-expiry] scheduled "${expression}"`);
  return task;
}
