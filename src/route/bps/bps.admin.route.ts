import express from "express";
import {
  getAllBpsUser,
  getOneBpsUser,
  deleteBpsUserMembership,
} from "../../controller/bps/bps.admin.controller.js";
import bpsAuth from "../../middelware/bpsAuth.js";
const router = express.Router();

router.get("/", bpsAuth, getAllBpsUser);
router.get("/:id", bpsAuth, getOneBpsUser);
router.delete("/:id", bpsAuth, deleteBpsUserMembership);

export default router;
