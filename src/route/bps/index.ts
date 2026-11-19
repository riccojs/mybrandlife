import express from "express";
import UserBpsRoute from "./bps.auth.route.js";
import AdminBpsRoute from "./bps.admin.route.js";

const router = express.Router();

router.use("/auth", UserBpsRoute);
router.use("/admin", AdminBpsRoute);

export default router;
