import express from "express";
import UserRoute from "./bps.auth.route.js";

const router = express.Router();

router.use("/auth", UserRoute);

export default router;
