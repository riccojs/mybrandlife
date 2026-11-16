import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllDomain,
  getOneDomain,
  deleteDomain,
} from "../controller/domain.controller.js";
const router = express.Router();

router.get("/", auth, getAllDomain);
router.get("/:id", auth, getOneDomain);
router.delete("/:id", auth, deleteDomain);

export default router;
