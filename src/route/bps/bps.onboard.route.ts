import express from "express";
import {
  OnboardBpsUser,
  updateOnboardInfo,
  updateOnboardMedia,
  deleteBpsOnboard,
  getAllBpsOnboard,
  getOneBpsOnboard,
  getAllBpsOnboardByStaff,
  verifyOnboard,
  connectOnboardSocial,
  uploadOnboardMedia,
  socialCallback,
  getOnboardMedia,
  deleteOnboardMedia,
} from "../../controller/bps/bps.onboard.controller.js";
import bpsMedias from "../../middelware/bps.medias.js";
import { authenticate, ROLES } from "../../middelware/auth.js";
import csUpload from "../../middelware/cs.upload.js";

// BPS users and staff both work on onboardings.
const bpsAuth = authenticate(ROLES.BPS, ROLES.STAFF);
const router = express.Router();

router.get("/", bpsAuth, getAllBpsOnboard);
router.get("/media/:id", bpsAuth, getOnboardMedia);
router.get("/staff", bpsAuth, getAllBpsOnboardByStaff);
router.get("/:id", bpsAuth, getOneBpsOnboard);
router.get("/social/callback", socialCallback);
router.post("/:id", bpsAuth, bpsMedias, OnboardBpsUser);
router.post("/platform/:id", bpsAuth, connectOnboardSocial);
router.patch("/info/:id", bpsAuth, updateOnboardInfo);
router.patch("/media/:id", bpsAuth, bpsMedias, updateOnboardMedia);
router.patch("/assets/:id", bpsAuth, csUpload, uploadOnboardMedia);
router.patch("/verify/:id", bpsAuth, verifyOnboard);
router.delete("/:id", bpsAuth, deleteBpsOnboard);
router.delete("/media/:id/:mediaId", bpsAuth, deleteOnboardMedia);

export default router;
