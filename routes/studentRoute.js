const express = require("express");
const router = express.Router();
const {
  studentLoginController,
  sendStudentInfo,
  changeStudentPassword,
  forgetStudentPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/student/app");
const {
  studentLoginAuth,
  verifyStudentToken,
} = require("../middlewares/studentAuthMiddleware");

router.post("/login", studentLoginAuth, studentLoginController);
router.get("/dashboard", verifyStudentToken, sendStudentInfo);
router.post("/change-password", verifyStudentToken, changeStudentPassword);
router.post("/forget-password", forgetStudentPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
