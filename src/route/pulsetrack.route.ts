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
} from "../controller/pulsetrack.controller.js";
const router = express.Router();

router.get("/", auth, getAllPulsetrack);
router.get("/:id", auth, getOnePulsetrack);
router.get("/check/:id", auth, checkPulsetrack);
router.post("/", auth, createPulsetrack);
router.post("/payment", auth, createPulsetrackPayment);
router.patch("/toggle/:id", auth, togglePulsetrack);
router.patch("/status/:id", auth, updatePulsetrackStatus);
router.patch("/assigned/:id", auth, assignedPulsetrackWristband);
router.patch("/:id", auth, updatePulsetrack);
router.delete("/:id", auth, deletePulsetrack);

export default router;
