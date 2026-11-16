import express from "express";
import {
  membershipWebhook,
  echoWebhook,
  renewalWebhook,
  pulsetrackwristbandWebhook,
  extraWristbandWebhook,
  bpsMembershipWebhook,
} from "../controller/webhook.controller.js";
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), membershipWebhook);
router.post(
  "/renewal",
  express.raw({ type: "application/json" }),
  renewalWebhook,
);
router.post("/echo", express.raw({ type: "application/json" }), echoWebhook);
router.post(
  "/wristband",
  express.raw({ type: "application/json" }),
  pulsetrackwristbandWebhook,
);
router.post(
  "/extrawristband",
  express.raw({ type: "application/json" }),
  extraWristbandWebhook,
);

router.post(
  "/bpsMembership",
  express.raw({ type: "application/json" }),
  bpsMembershipWebhook,
);

export default router;
