const {
  adminRegister,
  adminLoginController,
  changeAdminPassword,
} = require("./adminAuthController");
const {
  createClass,
  globalSearch,
  getAllClass,
} = require("./adminManagementController");
const {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} = require("./teacherManagement");
const {
  createStudent,
  getAllStudents,
  updateStudent,
  // deleteStudent,
} = require("./studentManagement");
const {
  createNotice,
  getAllNotice,
  deleteNotice,
} = require("./noticeManagement");
const {
  addGalleryImage,
  getAllImages,
  deleteImage,
} = require("./galleryManagement");
const {
  forgetAdminPassword,
  verifyOTP,
  resetPassword,
} = require("./forgetAdminPassword");
const { createEvent, getAllEvent, deleteEvent } = require("./eventManagement");
const { getAllCount } = require("./adminDashboard");
const { contactUs } = require("./contactUsController");
const {
  getAllStudentsByClass,
  markStudents,
} = require("./attendanceController");
const {
  checkAllStudentPayment,
  makeNewPayment,
  getPaymentHistory,
} = require("./paymentController");
const { getDashboardGraphData } = require("./earningController");

module.exports = {
  adminRegister,
  adminLoginController,
  changeAdminPassword,
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  createStudent,
  getAllStudents,
  updateStudent,
  // deleteStudent,
  createClass,
  globalSearch,
  getAllStudentsByClass,
  getAllClass,
  createNotice,
  getAllNotice,
  deleteNotice,
  addGalleryImage,
  getAllImages,
  deleteImage,
  forgetAdminPassword,
  verifyOTP,
  resetPassword,
  createEvent,
  getAllEvent,
  deleteEvent,
  getAllCount,
  contactUs,
  markStudents,
  checkAllStudentPayment,
  makeNewPayment,
  getPaymentHistory,
  getDashboardGraphData,
};
