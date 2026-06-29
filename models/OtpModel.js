import mongoose from "mongoose";

const otSchema = mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["register", "reset"], 
    required: true,
  },
  expiry_time: {
    type: String,
    default: "5min", 
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
otSchema.index({ created_at: 1 }, { expireAfterSeconds: 300 });
const OTP = mongoose.model("otp", otSchema);
export default OTP;
