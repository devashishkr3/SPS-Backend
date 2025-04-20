const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP id ${otp}. It is valid for 10 minutes only.`,
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: "OTP couldn't be sent",
          success: false,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Some Interval Problem in sending OTP",
      success: false,
    });
  }
};

module.exports = sendEmailOtp;
