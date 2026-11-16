import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  getAllPartner,
  getOnePartner,
  createPartner,
  updatePartner,
  deletePartner,
  getPlausibleData,
} from "../controller/partner.controller.js";
import profile from "../middelware/profile.js";
import partnerEmail from "../lib/partner.email.js";
import askQuestionEmail from "../lib/ask.question.email.js";
const router = express.Router();

router.get("/", publicSecretAuth, getAllPartner);
router.get("/:id", auth, getOnePartner);
router.get("/plausible/:landername", auth, getPlausibleData);
router.post("/", auth, profile, createPartner);
router.post("/send", publicSecretAuth, partnerEmail);
router.post("/help/send", publicSecretAuth, askQuestionEmail);
router.patch("/:id", auth, profile, updatePartner);
router.delete("/:id", auth, deletePartner);

export default router;
