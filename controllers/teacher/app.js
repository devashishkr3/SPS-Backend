const {
  teacherLoginController,
  changeTeacherPassword,
} = require("./teacherAuthController");
const { sendTeacherInfo } = require("./teacherInfoController");
const {
  forgetTeacherPassword,
  verifyOTP,
  resetPassword,
} = require("./forgetTeacherPassword");

module.exports = {
  teacherLoginController,
  changeTeacherPassword,
  sendTeacherInfo,
  forgetTeacherPassword,
  verifyOTP,
  resetPassword,
};
