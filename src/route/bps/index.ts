import express from "express";
import UserBpsRoute from "./bps.auth.route.js";
import BpsStaffRoute from "./bps.staff.route.js";
import BpsOnboardRoute from "./bps.onboard.route.js";
import BpsMembershipRoute from "./bps.membership.route.js";

const router = express.Router();

router.use("/auth", UserBpsRoute);
router.use("/staff", BpsStaffRoute);
router.use("/onboard", BpsOnboardRoute);
router.use("/membership", BpsMembershipRoute);

export default router;
