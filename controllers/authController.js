import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";
import OTP from "../models/OtpModel.js";
import { transporter } from "../utils/mailTransporter.js";
import Counter from "../models/CounterModel.js";

const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
    if (password === existingUser.password) {
      let userToken = await generateToken({
        user_id: existingUser.user_id,
        id: existingUser._id,
        email: existingUser.email,
        phone: existingUser?.phone,
      });
      res.status(200).json({
        message: "Logged In Succesfully !!",
        token: userToken,
        status: false,
      });
    } else {
      res
        .status(401)
        .json({ message: "Invalid Credentails !!", status: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
      status: false,
    });
  }
};

// 2.Register

const register = async (req, res) => {
  const { name, email, password, phone, role, fcm_token } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists! Please Login.",
        status: false,
      });
    }
    const counter = await Counter.findOneAndUpdate(
      { _id: "user_id" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const user_id = counter.sequence_value;
    const newUser = new User({
      user_id: user_id,
      name,
      email,
      password,
      phone,
      role: role || "user",
      fcm_token,
      is_verified: false,
    });

    await newUser.save(); // Ensure that user is saved before accessing user_id

    const userToken = await generateToken({
      user_id: newUser.user_id,
      email: newUser.email,
      phone: phone,
    });
    const otp = Math.floor(100000 + Math.random() * 900000);
    await OTP.deleteMany({ user_id: user_id, type: "register" });
    const data = new OTP({
      user_id: user_id,
      otp: otp,
      type: "register",
    });
    await data.save();
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: `${process.env.APP_NAME} - Complete Your Registration with OTP`,
      text: `Hi ${newUser.email || "there"
        },\n\nWelcome to ${process.env.APP_NAME}! \n\nTo complete your registration, please use the following One-Time Password (OTP):\n\n🔐 OTP: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not initiate this request, you can safely ignore this email.\n\nHappy travels,\nThe ${process.env.APP_NAME} Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to send OTP email",
          error: err.message,
          status: false,
        });
      } else {
        return res.status(200).json({
          message: "OTP sent successfully via email!",
          otp: otp, // In prod, avoid sending OTP in response
          status: true,
          user: {
            id: newUser._id,
            user_id: newUser.user_id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            token: userToken,
            is_verified: newUser.is_verified,
            status: true,
            fcm_token: newUser.fcm_token,
            otp: otp,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
      status: false,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, password, phone, role, fcm_token, user_id } = req.body;

    const user = await User.findOne({ user_id: user_id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    user.name = name || user.name;

    user.password = password || user.password;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.fcm_token = fcm_token || user.fcm_token;

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully!!",
      user: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        fcm_token: user.fcm_token,
        is_verified: user.is_verified,
        status: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
      status: false,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    const user_id = user?.user_id
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.deleteMany({ user_id: user_id, type: "reset" });

    // Now save the new OTP
    const data = new OTP({
      user_id: user_id,
      otp: otp,
      type: "reset",
    });

    await data.save();

    res.status(200).json({
      message: "OTP Sent Successfully!",
      otp: otp,
      user_id,
    });

    // Send OTP via email
    const mailOptions = {
      from: `"${process.env.APP_NAME} " <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `${process.env.APP_NAME} - Your OTP for Password Reset`,
      text: `Hi ${user.name || "there"
        },\n\nWe received a request to reset your password for your ${process.env.APP_NAME} account.\n\n Your One-Time Password (OTP) is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nSafe travels,\nThe ${process.env.APP_NAME} Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to send OTP email",
          error: err.message,
          status: false,
        });
      } else {
        return res.status(200).json({
          message: "OTP sent successfully via email!",
          otp: otp,
          status: true,
          user_id,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending OTP",
      error: error.message,
      status: false,
    });
  }
};
const VerifyOtp = async (req, res) => {
  const { user_id, otp, type } = req.body;

  try {
    const userOtp = await OTP.findOne({ user_id: user_id, type })
      .sort({ createdAt: -1 });


    if (!userOtp) {
      return res.status(404).json({
        message: "No OTP found for this user",
        status: false,
        type,
      });
    }

    if (userOtp.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP",
        status: false,
        user: userOtp.otp,
        otp,
      });
    }


    return res.status(200).json({
      message: "OTP Verified Successfully",
      status: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      message: "Server error during OTP verification",
      error: error.message,
      status: false,
    });
  }
};

export default { login, register, updateProfile, resetPassword, VerifyOtp };
