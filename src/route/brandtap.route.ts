import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllBrandtap,
  getOneBrandtap,
  createBrandtap,
  deleteBrandtap,
  checkBrandtap,
  updateBrandtap,
  updateBrandtapStatus,
  assignedBrandtapWristband,
  updateBrandtapWristbandStatus,
} from "../controller/brandtap.controller.js";
const router = express.Router();

router.get("/", auth, getAllBrandtap);
router.get("/:id", auth, getOneBrandtap);
router.get("/check/:id", auth, checkBrandtap);
router.post("/", auth, createBrandtap);
router.patch("/:id", auth, updateBrandtap);
router.patch("/status/:id", auth, updateBrandtapStatus);
router.patch("/assigned/:id", auth, assignedBrandtapWristband);
router.patch("/wristband/status/:id", auth, updateBrandtapWristbandStatus);
router.delete("/:id", auth, deleteBrandtap);

export default router;
