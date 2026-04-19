import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllGroup,
  getOneGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleSpin,
  assignGroupItem,
  updateGroupItem,
  deleteGroupItem,
  getOneGroupItem,
} from "../controller/spin.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
const router = express.Router();

router.get("/group", publicSecretAuth, getAllGroup);
router.get("/group/item/:id", auth, getOneGroupItem);
router.get("/group/:id", auth, getOneGroup);
router.post("/group", auth, createGroup);
router.post("/group/item", auth, assignGroupItem);
router.patch("/toggle/:id", auth, toggleSpin);
router.patch("/group/:id", auth, updateGroup);
router.patch("/group/item/:id", auth, updateGroupItem);
router.delete("/group/:id", auth, deleteGroup);
router.delete("/group/item/:id", auth, deleteGroupItem);

export default router;
