import * as Yup from "yup";

export const createRoomSchema = Yup.object().shape({
    user_id: Yup.number().required("User ID is required"),
    receiver_id: Yup.number().required("Receiver ID is required"),
});

export const joinRoomSchema = Yup.object().shape({
    user_id: Yup.number().required("User ID is required"),
    room_id: Yup.string().required("Room ID is required"),
    // liveKitToken: Yup.string().required("LiveKit Token is required"),
});

export const leaveRoomSchema = Yup.object().shape({
    user_id: Yup.number().required("User ID is required"),
    room_id: Yup.string().required("Room ID is required"),
});

export const startRecordingSchema = Yup.object().shape({
    room_id: Yup.string().required("Room ID is required"),
});

export const stopRecordingSchema = Yup.object().shape({
    egress_id: Yup.string().required("Egress ID is required"),
});