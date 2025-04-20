const Teacher = require("../../models/teacherModel");
const sendEmailOtp = require("../../utils/emailService");
const bcrypt = require("bcrypt");
require("dotenv").config();

const otpStorage = {};

const forgetTeacherPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is Required",
        succcess: false,
      });
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher Not Found with this Email",
        success: false,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    //sending Email OTP
    sendEmailOtp(email, otp);

    return res.status(200).json({
      message: "OTP sent Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otpStorage[email]) {
      return res.status(400).json({
        message: "OTP Expired or Invalid",
        success: false,
      });
    }

    const { otp: storedOTP, expiresAt } = otpStorage[email];

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        message: "OTP Expired",
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

    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        message: "New Password is Required",
        success: false,
      });
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found with this Email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;

    await teacher.save();

    return res.status(200).json({
      message: "Password Reset successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { forgetTeacherPassword, verifyOTP, resetPassword };
