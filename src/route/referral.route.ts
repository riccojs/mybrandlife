import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllReferral,
  getOneReferral,
  createReferral,
  updateReferral,
  deleteReferral,
} from "../controller/referral.controller.js";
const router = express.Router();

router.get("/", auth, getAllReferral);
router.get("/:id", auth, getOneReferral);
router.post("/", auth, createReferral);
router.patch("/:id", auth, updateReferral);
router.delete("/:id", auth, deleteReferral);

export default router;
