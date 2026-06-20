import express from "express";
import {
  expiredBrandshare,
  expiredMembership,
  deleteActivityLog,
} from "../controller/corn.controller.js";
const router = express.Router();

router.post("/expired-brandshare", expiredBrandshare);
router.post("/expired-membership", expiredMembership);
router.post("/delete-activitylog", deleteActivityLog);

export default router;
