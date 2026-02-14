import express from "express";
import {
  membershipWebhook,
  echoWebhook,
  renewalWebhook,
} from "../controller/webhook.controller.js";
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), membershipWebhook);
router.post(
  "/renewal",
  express.raw({ type: "application/json" }),
  renewalWebhook,
);
router.post("/echo", express.raw({ type: "application/json" }), echoWebhook);

export default router;
