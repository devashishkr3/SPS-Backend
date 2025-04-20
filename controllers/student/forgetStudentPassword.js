const Student = require("../../models/studentModel");
// const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const sendEmailOtp = require("../../utils/emailService");
require("dotenv").config();

const otpStorage = {};

const forgetStudentPassword = async (req, res) => {
  try {
    const { studnetID } = req.body;
    if (!studentID) {
      return res.status(400).json({
        message: "StudentID is Required",
        success: false,
      });
    }
    const student = await Student.findOne({ studentID });
    if (!student) {
      return res.status(404).json({
        message: "Student Not Found",
        success: false,
      });
    }
    const otp = Math.floor(100000 + math.random() * 900000);

    otpStorage[student.email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    //sending OTP to Email
    await sendEmailOtp(email, otp);

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
    const { studentID, otp } = req.body;
    const student = await Student.findOne({ studentID });
    if (!student) {
      return res.status(404).json({
        message: "Student not found with this StudentID",
        success: false,
      });
    }
    if (!otpStorage[student.email]) {
      return res.status(400).json({
        message: "OTP expired or Invalid",
        success: false,
      });
    }

    const { otp: storedOTP, expiresAt } = otpStorage[student.email];

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        message: "OTP id expired",
        success: false,
      });
    }

    if (parseInt(otp) !== storedOTP) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    delete otpStorage[student.email];

    return res.status(200).json({
      message: "OTP verified successfully",
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
    const { studentID, newPassword } = req.body;
    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(404).json({
        message: "Student not Found With this StudentID",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    return res.status(200).json({
      message: "Password Reset Successful",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { forgetStudentPassword, verifyOTP, resetPassword };
