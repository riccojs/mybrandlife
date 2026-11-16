import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllReferral,
  getOneReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  getAllReferralUser,
} from "../controller/referral.controller.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.get("/", auth, getAllReferral);
router.get("/user", auth, getAllReferralUser);
router.get("/:id", auth, getOneReferral);
router.post("/", auth, profile, createReferral);
router.patch("/:id", auth, profile, updateReferral);
router.delete("/:id", auth, deleteReferral);

export default router;
