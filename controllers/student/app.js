const {
  studentLoginController,
  changeStudentPassword,
} = require("./studentAuthController");
const { sendStudentInfo } = require("./studentInfoController");
const {
  forgetStudentPassword,
  verifyOTP,
  resetPassword,
} = require("./forgetStudentPassword");

module.exports = {
  studentLoginController,
  sendStudentInfo,
  changeStudentPassword,
  forgetStudentPassword,
  verifyOTP,
  resetPassword,
};
