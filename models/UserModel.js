import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      default: "user",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    fcm_token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate user_id (optional, but helpful if you want custom user_id)
UserSchema.pre("save", async function (next) {
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
