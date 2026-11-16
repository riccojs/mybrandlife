import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllReport,
  getOneReport,
  createReport,
  updateReport,
  deleteReport,
} from "../controller/report.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
const router = express.Router();

router.get("/", auth, getAllReport);
router.get("/:id", auth, getOneReport);
router.post("/", publicSecretAuth, createReport);
router.patch("/:id", auth, updateReport);
router.delete("/:id", auth, deleteReport);

export default router;
