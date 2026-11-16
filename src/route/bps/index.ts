import express from "express";
import UserRoute from "./bps.auth.route";

const router = express.Router();

router.use("/auth", UserRoute);

export default router;
