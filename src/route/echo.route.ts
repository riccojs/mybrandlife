import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  createEcho,
  getAllEcho,
  getOneEcho,
  updateEcho,
  deleteEcho,
  connectStripeAccount,
  toggleEcho,
  updateEchoStatus,
  getAllEchoByLander,
  checkStripeConnection,
} from "../controller/echo.controller.js";
const router = express.Router();

router.get("/", auth, getAllEcho);
router.get("/lander", publicSecretAuth, getAllEchoByLander);
router.get("/:id", auth, getOneEcho);
router.get("/stripe/connection/:id", publicSecretAuth, checkStripeConnection);
router.post("/", publicSecretAuth, createEcho);
router.post("/stripe/connect", auth, connectStripeAccount);
router.patch("/status/:id", auth, updateEchoStatus);
router.patch("/toggle/:id", auth, toggleEcho);
router.patch("/:id", auth, updateEcho);
router.delete("/:id", auth, deleteEcho);

export default router;
