import express from "express";
import publicSecretAuth from "../../middelware/public.secret.auth.js";
import {
  loggedBpsUser,
  registerBpsUser,
  checkoutBpsUser,
  verifyBpsUser,
  loginBpsUser,
  OnboardBpsUser,
  registerBpsStaff,
} from "../../controller/bps/bps.auth.conroller.js";
import bpsMedias from "../../middelware/bps.medias.js";
import { googleDriveConnect } from "../../config/googleDriveConnect.js";
import { googleDriveCallback } from "../../config/googleDriveCallback.js";
import bpsAuth from "../../middelware/bpsAuth.js";
const router = express.Router();

router.get("/google-drive/connect", googleDriveConnect);
router.get("/google-drive/callback", googleDriveCallback);
router.get("/logged", bpsAuth, loggedBpsUser);
router.post("/register", publicSecretAuth, registerBpsUser);
router.post("/register/staff", bpsAuth, registerBpsStaff);
router.post("/login", publicSecretAuth, loginBpsUser);
router.post("/verify", publicSecretAuth, verifyBpsUser);
router.post("/checkout/:id", bpsAuth, checkoutBpsUser);
router.post("/onboard/:id", bpsMedias, bpsAuth, OnboardBpsUser);

export default router;
