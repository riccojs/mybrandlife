import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllUser,
  register,
  login,
  verify,
  logout,
  logged,
  reset,
  sendResetCode,
  sendResetOtp,
  findLanderName,
  getOneUserByLandername,
  getOneUser,
  getAllUserByAdmin,
  togglrUserDirectoryStatus,
  togglrUserBrandshare,
  verifyUserByAdmin,
  updateUser,
  updateUserByAdmin,
  updatePassword,
  updateUserPasswordByAdmin,
  updateUserMembership,
  togglrUserActivation,
  deleteUser,
} from "../controller/user.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import profile from "../middelware/profile.js";

const router = express.Router();

router.get("/logged", auth, logged);
router.get("/admin", publicSecretAuth, getAllUserByAdmin);
router.get("/affiliate/:name", publicSecretAuth, getOneUserByLandername);
router.get("/", auth, getAllUser);
router.get("/:id", auth, getOneUser);
router.post("/register", publicSecretAuth, register);
router.post("/login", publicSecretAuth, login);
router.post("/verify", publicSecretAuth, verify);
router.post("/logout", auth, logout);
router.post("/send/code", publicSecretAuth, sendResetCode);
router.post("/send/otp", publicSecretAuth, sendResetOtp);
router.post("/reset", publicSecretAuth, reset);
router.post("/find", publicSecretAuth, findLanderName);
router.patch("/directory/:id", auth, togglrUserDirectoryStatus);
router.patch("/brandshare/:id", auth, togglrUserBrandshare);
router.patch("/verify/admin", auth, verifyUserByAdmin);
router.patch("/:id", auth, profile, updateUser);
router.patch("/admin/update/:id", auth, profile, updateUserByAdmin);
router.patch("/password/:id", auth, updatePassword);
router.patch("/password/admin/:id", auth, updateUserPasswordByAdmin);
router.patch("/membership/:id", auth, updateUserMembership);
router.patch("/toggle/activation/:id", auth, togglrUserActivation);
router.delete("/:id", auth, deleteUser);

export default router;
