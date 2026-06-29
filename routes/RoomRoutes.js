import express from "express";
import { validateUserToken } from "../middleware/validateUserToken.js";
import RoomController from "../controllers/RoomController.js";
import validateFields from "../middleware/validateFields.js";
import { createRoomSchema, joinRoomSchema, leaveRoomSchema, startRecordingSchema, stopRecordingSchema } from "../schemas/roomSchema.js";
const router = express.Router();

router.post("/create-room", validateUserToken, validateFields(createRoomSchema), RoomController.createRoom);
router.post("/join-room", validateUserToken, validateFields(joinRoomSchema), RoomController.joinRoom);
router.post("/leave-room", validateUserToken, validateFields(leaveRoomSchema), RoomController.leaveRoom);
router.post("/start-recording", validateUserToken, validateFields(startRecordingSchema), RoomController.startRecording);
router.post("/stop-recording", validateUserToken, validateFields(stopRecordingSchema), RoomController.stopRecording);

export default router;
