import express from "express";
import auth from "../middelware/auth.js";
import publicSecretAuth from "../middelware/public.secret.auth.js";
import {
  onboardingUser,
  updateTempleteSocial,
  updateTempleteMedias,
  updateTempleteInfos,
  deleteTemplete,
  checkDiscountCode,
  requestADomain,
  getAllOnboard,
  getOneOboard,
  recreatePayment,
  getOneOboardById,
  updateMemebership,
  getAllOnboardByAdmin,
  verifyOnboard,
  requestInfo,
  requestInfoLocation,
  getAllOnboardByDefault,
  toggleMerchendiseStatus,
  updateCustomPlatform,
  deleteTempleteButton,
  deleteCustomButton,
} from "../controller/onboard.controller.js";
import medias from "../middelware/medias.js";
const router = express.Router();

router.get("/", auth, getAllOnboard);
router.get("/admin", auth, getAllOnboardByAdmin);
router.get("/default", auth, getAllOnboardByDefault);
router.get("/:id", auth, getOneOboardById);
router.get("/wirframe/:name", publicSecretAuth, getOneOboard);
router.post("/", auth, medias, onboardingUser);
router.post("/recreate/:id", auth, recreatePayment);
router.post("/request", publicSecretAuth, requestADomain);
router.post("/request/info", publicSecretAuth, requestInfo);
router.post("/request/info/location", publicSecretAuth, requestInfoLocation);
router.post("/discount", publicSecretAuth, checkDiscountCode);
router.put("/images/:id", auth, medias, updateTempleteMedias);
router.put("/social/:id", auth, updateTempleteSocial);
router.put("/custom/platform/:id", auth, updateCustomPlatform);
router.put("/info/:id", auth, updateTempleteInfos);
router.put("/membership/:id", auth, updateMemebership);
router.put("/merchendise/:id", auth, toggleMerchendiseStatus);
router.put("/verify/:id", auth, verifyOnboard);
router.delete("/:id", auth, deleteTemplete);
router.delete("/social/:id", auth, deleteTempleteButton);
router.delete("/custom/:id", auth, deleteCustomButton);

export default router;
