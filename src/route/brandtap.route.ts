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
  createBrandtapPayment,
  toggleBrandtap,
} from "../controller/brandtap.controller.js";
const router = express.Router();

router.get("/", auth, getAllBrandtap);
router.get("/:id", auth, getOneBrandtap);
router.get("/check/:id", auth, checkBrandtap);
router.post("/", auth, createBrandtap);
router.post("/payment", auth, createBrandtapPayment);
router.patch("/toggle/:id", auth, toggleBrandtap);
router.patch("/status/:id", auth, updateBrandtapStatus);
router.patch("/assigned/:id", auth, assignedBrandtapWristband);
router.patch("/:id", auth, updateBrandtap);
router.delete("/:id", auth, deleteBrandtap);

export default router;
