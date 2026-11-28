import express from "express";
import {
  getAllBpsStaff,
  registerBpsStaff,
  loginBpsStaff,
  loggedBpsStaff,
  deleteBpsStaff,
  updateBpsStaff,
  updateBpsStaffStatus,
  updateBpsStaffPassword,
} from "../../controller/bps/bps.staff.controller.js";

import auth, {
  authenticate,
  logoutRole,
  ROLES,
} from "../../middelware/auth.js";
import publicSecretAuth from "../../middelware/public.secret.auth.js";
import profile from "../../middelware/profile.js";
const staffAuth = authenticate(ROLES.STAFF);
const router = express.Router();

router.get("/", auth, getAllBpsStaff);
router.get("/logged", staffAuth, loggedBpsStaff);
router.post("/register", publicSecretAuth, registerBpsStaff);
router.post("/login", publicSecretAuth, loginBpsStaff);
router.post("/logout", logoutRole(ROLES.STAFF));
router.patch("/:id", staffAuth, profile, updateBpsStaff);
router.patch("/status/:id", staffAuth, updateBpsStaffStatus);
router.patch("/password/:id", staffAuth, updateBpsStaffPassword);
router.delete("/:id", staffAuth, deleteBpsStaff);

export default router;
