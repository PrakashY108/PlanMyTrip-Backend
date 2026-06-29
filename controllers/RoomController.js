import Room from "../models/RoomModal.js";
import { v4 as uuidv4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";
import axios from "axios";
import { EgressClient, EncodedFileOutput } from "livekit-server-sdk";
const generateLiveKitToken = async ({ user_id, room_id }) => {
  const generateToken = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: user_id.toString(),
    room: room_id,
  });
  generateToken.addGrant({
    roomJoin: true,
    room: room_id,
    canPublish: true,
    canSubscribe: true,
  });
  return generateToken.toJwt();
};

const createRoom = async (req, res) => {
  const { user_id, receiver_id } = req.body;
  const room_id = uuidv4();
  const room = await Room.create({ user_id, receiver_id, room_id, is_active: true });

  res.status(200).json({ message: "Room created successfully", status: true, room });
};

const joinRoom = async (req, res) => {
  try {
    // const user_id = req.body.user_id; 
    const { room_id, user_id } = req.body;

    const room = await Room.findOne({
      room_id,
      is_active: true,
      $or: [
        { user_id },
        { receiver_id: user_id }
      ]
    });

    if (!room) {
      return res.status(404).json({
        status: false,
        message: "Room not found",
      });
    }

    const token = await generateLiveKitToken({
      user_id,
      room_id,
    });

    return res.status(200).json({
      status: true,
      message: "Room joined successfully",
      room_id,
      token,
      livekit_url: process.env.LIVEKIT_URL,
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const leaveRoom = async (req, res) => {
  const { user_id, room_id } = req.body;
  const room = await Room.findOne({ room_id, user_id });
  if (!room) {
    return res.status(404).json({ message: "Room not found", status: false });
  }
  room.is_active = false;
  await room.save();
  res.status(200).json({ message: "Room left successfully", status: true });
};





export const startRecording = async (req, res) => {
  try {
    const { room_id } = req.body;

    const egressClient = new EgressClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    const output = {
      file: {
        filepath: `recordings/${room_id}-${Date.now()}.mp4`,
      },
    };

    const response = await egressClient.startRoomCompositeEgress(
      room_id,
      output
    );

    return res.status(200).json({
      status: true,
      message: "Recording started",
      data: response,
    });
  } catch (error) {
    console.log("Egress error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export const stopRecording = async (req, res) => {
  try {
    const { egress_id } = req.body;

    const egressClient = new EgressClient(
      process.env.LIVEKIT_URL,
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET
    );

    const response = await egressClient.stopEgress(egress_id);

    return res.json({
      status: true,
      message: "Recording stopped",
      data: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
export default { createRoom, joinRoom, leaveRoom, startRecording, stopRecording };