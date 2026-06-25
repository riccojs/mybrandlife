import express from "express";
import auth from "../middelware/auth.js";
import {
  getAllNotification,
  getOneNotification,
  deleteNotification,
  seenNotification,
} from "../controller/notification.controller.js";
const router = express.Router();

router.get("/", auth, getAllNotification);
router.get("/:id", auth, getOneNotification);
router.patch("/:id", auth, seenNotification);
router.delete("/:id", auth, deleteNotification);

export default router;
