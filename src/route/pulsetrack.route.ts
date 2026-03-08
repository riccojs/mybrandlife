import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllPulsetrack,
  getOnePulsetrack,
  createPulsetrack,
  deletePulsetrack,
  checkPulsetrack,
  updatePulsetrack,
  updatePulsetrackStatus,
  assignedPulsetrackWristband,
  createPulsetrackPayment,
  togglePulsetrack,
  toggleExtraPulsetrackCost,
  getPulsetrackCart,
  deleteCartItem,
  savePulsetrackScan,
  saveGpsPulsetrackScan,
  getDefaultPulsetrack,
  exportPulsetrackData,
  getAllExportData,
} from "../controller/pulsetrack.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
const router = express.Router();

router.get("/", auth, getAllPulsetrack);
router.get("/cart", auth, getPulsetrackCart);
router.get("/default", auth, getDefaultPulsetrack);
router.get("/export", auth, getAllExportData);
router.get("/:id", auth, getOnePulsetrack);
router.post("/", auth, createPulsetrack);
router.post("/payment", auth, createPulsetrackPayment);
router.post("/check", auth, checkPulsetrack);
router.post("/scan/:id", publicSecretAuth, savePulsetrackScan);
router.post("/scan/gps/:id", publicSecretAuth, saveGpsPulsetrackScan);
router.post("/export/:id", auth, exportPulsetrackData);
router.patch("/toggle/:id", auth, togglePulsetrack);
router.patch("/extra/:id", auth, toggleExtraPulsetrackCost);
router.patch("/status/:id", auth, updatePulsetrackStatus);
router.patch("/assigned/:id", auth, assignedPulsetrackWristband);
router.patch("/:id", auth, updatePulsetrack);
router.delete("/cart/:id", auth, deleteCartItem);
router.delete("/:id", auth, deletePulsetrack);

export default router;
