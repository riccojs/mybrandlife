import express from "express";
import {
  getBpsMembership,
  closeBpsMembership,
  renewBpsMembership,
} from "../../controller/bps/bps.membership.controller.js";
import { authenticate, ROLES } from "../../middelware/auth.js";

// A BPS user manages their own membership (identified by their login).
const bpsUser = authenticate(ROLES.BPS);
const router = express.Router();

router.get("/", bpsUser, getBpsMembership);
router.post("/close", bpsUser, closeBpsMembership);
router.post("/renew", bpsUser, renewBpsMembership);

export default router;
