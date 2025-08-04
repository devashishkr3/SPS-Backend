const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const BlacklistedToken = require("../models/blacklistedToken");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs-extra");
const upload = require("../utils/multerConfig");
require("dotenv").config();
const sendEmailOtp = require("../utils/emailService");
const sendSMS = require("../utils/smsService");

const JWT_SECRET = process.env.JWT_SECRET;

// Register Admin
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) {
      return res.status(404).json({
        message: "Admin Image is Required",
        success: false,
      });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this email already exists.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Admin_Profile",
    });

    await fs.unlink(req.file.path); // deleting file from locals/server

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      image: result.secure_url,
      imageID: result.public_id,
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully.",
      success: true,
      admin: {
        id: savedAdmin._id,
        name: savedAdmin.name,
        email: savedAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error in admin registration:", error);
    res.status(500).json({
      message: "An error occurred during registration.",
      success: false,
    });
  }
};

//admin Login
exports.adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false,
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(403).json({
        message: "Invalid email.",
        success: false,
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password.",
        success: false,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with success
    return res.status(200).json({
      message: "Login successful.",
      success: true,
      token,
      adminData: {
        adminName: admin.name,
        adminEmail: admin.email,
        adminProfile: admin.image,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

//change Admin Password
exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide Email ID",
        success: false,
      });
    }

    // Get single admin document
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found with this email",
        success: false,
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old and new Password are required",
        success: false,
      });
    }

    // Use await to compare passwords
    const isPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    if (name) {
      admin.name = name;
    }
    await admin.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in changeAdminPassword:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

exports.adminLogoutController = async (req, res) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(404).json({
        message: "Token not provided",
        success: false,
      });
    }

    await BlacklistedToken.create({ token });

    return res.status(200).json({
      message: "Logout Successful",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

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
