import express from "express";
import publicSecretAuth from "../../middelware/public.secret.auth.js";
import {
  loggedBpsUser,
  checkoutBpsUser,
  verifyBpsUser,
  loginBpsUser,
  registerBpsUser,
  createUserWorkspace,
} from "../../controller/bps/bps.auth.conroller.js";
import {
  authenticate,
  logoutRole,
  ROLES,
} from "../../middelware/auth.js";

const bpsAuth = authenticate(ROLES.BPS, ROLES.STAFF);
const router = express.Router();

router.get("/logged", authenticate(ROLES.BPS), loggedBpsUser);
router.post("/logout", logoutRole(ROLES.BPS));
router.post("/register", publicSecretAuth, registerBpsUser);
router.post("/login", publicSecretAuth, loginBpsUser);
router.post("/verify", publicSecretAuth, verifyBpsUser);
router.post("/checkout/:id", bpsAuth, checkoutBpsUser);
router.patch("/workspace/:id", bpsAuth, createUserWorkspace);

export default router;
