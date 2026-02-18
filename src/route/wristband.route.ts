import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllWristband,
  getOneWristband,
  createWristband,
  updateWristband,
  deleteWristband,
  createPlanWristband,
} from "../controller/wristband.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.get("/", publicSecretAuth, getAllWristband);
router.get("/:id", auth, getOneWristband);
router.post("/", auth, profile, createWristband);
router.post("/plan", auth, profile, createPlanWristband);
router.patch("/:id", auth, profile, updateWristband);
router.delete("/:id", auth, deleteWristband);

export default router;
