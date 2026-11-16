import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  getAllContact,
  getOneContact,
  createContact,
  updateContact,
  deleteContact,
  seenContact,
} from "../controller/contact.controller.js";
const router = express.Router();

router.get("/", auth, getAllContact);
router.get("/:id", auth, getOneContact);
router.post("/", publicSecretAuth, createContact);
router.put("/:id", auth, updateContact);
router.put("/status/:id", auth, seenContact);
router.delete("/:id", auth, deleteContact);

export default router;
