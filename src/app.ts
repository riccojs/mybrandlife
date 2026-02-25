import "dotenv/config";
import express from "express";
import cors from "cors";
import response from "./utils/response.js";
import status from "./utils/status.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { closeMembership } from "./middelware/close.membership.js";
import auth from "./middelware/auth.js";
import errorHandler from "./middelware/error.handler.js";
const app = express();
const { CORS_ERROR_MESSAGE, HOME_ROUTE_MESSAGE, ROUTE_NOT_FOUND_MESSAGE } =
  response;
const { SUCCESS_STATUS, ERROR_STATUS } = status;
import UserRouter from "./route/user.route.js";
import AdminRouter from "./route/admin.route.js";
import OnboardRouter from "./route/onboard.route.js";
import EchoRouter from "./route/echo.route.js";
import ContactRouter from "./route/contact.route.js";
import DomainRouter from "./route/domain.route.js";
import BrandbookRouter from "./route/brandbook.route.js";
import PartnerRouter from "./route/partner.route.js";
import ReferralRouter from "./route/referral.route.js";
import ReportRouter from "./route/report.route.js";
import WristbandRouter from "./route/wristband.route.js";
import WebhookRouter from "./route/webhook.route.js";
import PulsetrackRouter from "./route/pulsetrack.route.js";
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];
const publicPath = process.env.PUBLIC_PATH as string;

// app middlewares
app.use("/webhook", WebhookRouter);
app.use(cookieParser());
app.use(express.json());
app.use("/public", express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(CORS_ERROR_MESSAGE));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "x-api-key"],
  }),
);

// expired membership
cron.schedule("0 0 * * *", () => {
  closeMembership();
});

// all routes
app.use("/api/auth", UserRouter);
app.use("/api/auth/admin", AdminRouter);
app.use("/api/onboard", OnboardRouter);
app.use("/api/echo", EchoRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/domain", DomainRouter);
app.use("/api/brandbook", BrandbookRouter);
app.use("/api/partner", PartnerRouter);
app.use("/api/referral", ReferralRouter);
app.use("/api/report", ReportRouter);
app.use("/api/wristband", WristbandRouter);
app.use("/api/pulsetrack", PulsetrackRouter);

// Home Route
app.get("/", auth, (req, res) => {
  res.status(200).json({
    status: SUCCESS_STATUS,
    message: HOME_ROUTE_MESSAGE,
  });
});

// error middleware
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    status: ERROR_STATUS,
    message: ROUTE_NOT_FOUND_MESSAGE,
  });
});

export default app;
