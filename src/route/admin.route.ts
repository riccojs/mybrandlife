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
  deleteActivities,
  getAllActivities,
  getOneActivities,
} from "../controller/admin.controller.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.get("/activities", auth, getAllActivities);
router.get("/logged", auth, logged);
router.get("/setting", publicSecretAuth, getSetting);
router.get("/activities/:id", auth, getOneActivities);
router.post("/register", publicSecretAuth, register);
router.post("/register", publicSecretAuth, register);
router.post("/login", publicSecretAuth, login);
router.post("/logout", auth, logout);
router.patch("/:id", auth, profile, update);
router.patch("/setting/:id", auth, updateSetting);
router.delete("/:id", auth, deleteAdmin);
router.delete("/activities/:id", auth, deleteActivities);

export default router;
