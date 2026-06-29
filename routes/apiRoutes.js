import express from "express";
import apiController from "../controllers/apiController.js";
import { validateUserToken } from "../middleware/validateUserToken.js";

const router = express.Router();

router.post("/get-distance", validateUserToken,apiController.CalculateDistance);
router.get("/get-notification",validateUserToken, apiController.getNotification);
router.get("/get-profile",validateUserToken, apiController.getProfile);

export default router;
