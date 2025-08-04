const Admin = require("../models/adminModel");
// const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const sendEmailOtp = require("../utils/emailService");
const sendSMS = require("../utils/smsService");
require("dotenv").config();

const otpStorage = {};

exports.forgetAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkAdmin = await Admin.findOne({ email });
    if (!checkAdmin) {
      return res.status(404).json({
        message: "Admin not found with this email",
        success: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    //sending OTP in email
    await sendEmailOtp(email, otp);

    return res.status(200).json({
      messge: "OTP sent successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStorage[email]) {
      return res.status(400).json({
        message: "OTP expired or invalid",
        success: false,
      });
    }

    const { otp: storedOTP, expiresAt } = otpStorage[email];

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        message: "OTP is expired",
        success: false,
      });
    }

    if (parseInt(otp) !== storedOTP) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }
    delete otpStorage[email];

    res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      message: "New Password is Required",
      success: false,
    });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({
      message: "Admin not found",
      success: false,
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();

  return res.status(200).json({
    message: "Password Reset Successful",
    success: true,
  });
};
