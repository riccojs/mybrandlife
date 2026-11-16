import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllSpining,
  getOneSpining,
  createSpining,
  updateSpining,
  deleteSpining,
  toggleSpin,
} from "../controller/spin.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
const router = express.Router();

router.get("/", publicSecretAuth, getAllSpining);
router.get("/:id", auth, getOneSpining);
router.post("/", auth, createSpining);
router.patch("/toggle/:id", auth, toggleSpin);
router.patch("/:id", auth, updateSpining);
router.delete("/:id", auth, deleteSpining);

export default router;
