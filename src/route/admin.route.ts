import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  login,
  register,
  logged,
  logout,
  update,
  deleteAdmin,
  updateSetting,
  getSetting,
} from "../controller/admin.controller.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.post("/register", publicSecretAuth, register);
router.post("/login", publicSecretAuth, login);
router.post("/logout", auth, logout);
router.get("/logged", auth, logged);
router.get("/setting", publicSecretAuth, getSetting);
router.patch("/:id", auth, profile, update);
router.patch("/setting/:id", auth, updateSetting);
router.delete("/:id", auth, deleteAdmin);

export default router;
