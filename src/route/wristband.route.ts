import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllWristband,
  getOneWristband,
  createWristband,
  updateWristband,
  deleteWristband,
  updateWristbandItemStatus,
  getAllWristbandItem,
  getOneWristbandItem,
  deleteWristbandItem,
  getOneWristbandItemById,
  getAllWristbandItemByMode,
  getAllOrderedWristband,
} from "../controller/wristband.controller.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import profile from "../middelware/profile.js";
const router = express.Router();

router.get("/", publicSecretAuth, getAllWristband);
router.get("/item", auth, getAllWristbandItem);
router.get("/item/mode", auth, getAllWristbandItemByMode);
router.get("/item/ordered/:id", auth, getAllOrderedWristband);
router.get("/item/tracking/:id", publicSecretAuth, getOneWristbandItem);
router.get("/item/:id", auth, getOneWristbandItemById);
router.get("/:id", auth, getOneWristband);
router.post("/", auth, profile, createWristband);
router.patch("/:id", auth, profile, updateWristband);
router.patch("/item/status/:id", auth, profile, updateWristbandItemStatus);
router.delete("/item/:id", auth, deleteWristbandItem);
router.delete("/:id", auth, deleteWristband);

export default router;
