import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  createEvent,
  goolgeAuth,
  googleAuthCallback,
  createSlot,
  getAllEvent,
  getAllSlot,
  deleteSlot,
  toggleEvent,
  getOneEvent,
  deleteEvent,
  updateEventStatus,
  getAllSlotByLander,
  updateEvent,
} from "../controller/brandbook.controller.js";
const router = express.Router();

router.get("/", auth, getAllEvent);
router.get("/slot", auth, getAllSlot);
router.get("/slot/lander", publicSecretAuth, getAllSlotByLander);
router.get("/google", goolgeAuth);
router.get("/google/callback", googleAuthCallback);
router.get("/:id", auth, getOneEvent);
router.post("/", publicSecretAuth, createEvent);
router.post("/slot", auth, createSlot);
router.patch("/:id", auth, updateEvent);
router.patch("/toggle/:id", auth, toggleEvent);
router.patch("/status/:id", auth, updateEventStatus);
router.delete("/slot/:id", auth, deleteSlot);
router.delete("/:id", auth, deleteEvent);

export default router;
