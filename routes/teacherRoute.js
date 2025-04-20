const express = require("express");
const router = express.Router();
const {
  teacherLoginAuth,
  verifyTeacherToken,
} = require("../middlewares/teacherAuthMiddleware");
const {
  teacherLoginController,
  sendTeacherInfo,
  changeTeacherPassword,
  forgetTeacherPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/teacher/app");
const Class = require("../models/classModel");

router.post("/login", teacherLoginAuth, teacherLoginController);
router.get("/", verifyTeacherToken, sendTeacherInfo);
router.post("/change-password", verifyTeacherToken, changeTeacherPassword);
router.post("/forget-password", forgetTeacherPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
