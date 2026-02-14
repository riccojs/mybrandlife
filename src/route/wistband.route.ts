import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllWistband,
  getOneWistband,
  deleteWistband,
  updateWisetbandStatus,
  getOneWistbandByOrderId,
} from "../controller/wistband.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.get("/", auth, getAllWistband);
router.get("/:id", auth, getOneWistband);
router.get("/order/:id", publicSecretAuth, getOneWistbandByOrderId);
router.patch("/:id", auth, profile, updateWisetbandStatus);
router.delete("/:id", auth, deleteWistband);

export default router;
