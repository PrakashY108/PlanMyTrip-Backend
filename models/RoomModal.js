import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    receiver_id: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;