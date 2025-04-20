const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const sendEmailToAdmin = async (email, subject, text, res) => {
  try {
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: "Response Msg Cann't be Sent",
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

module.exports = sendEmailToAdmin;
