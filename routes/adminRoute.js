const express = require("express");
const router = express.Router();
const {
  adminLoginController,
  adminRegister,
  changeAdminPassword,
  adminLogoutController,
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  createStudent,
  getAllStudents,
  updateStudent,
  // deleteStudent,
  createClass,
  getAllClass,
  globalSearch,
  createNotice,
  getAllNotice,
  deleteNotice,
  addGalleryImage,
  getAllImages,
  deleteImage,
  // changeAdminPassword,
  forgetAdminPassword,
  verifyOTP,
  resetPassword,
  getAllCount,
  createEvent,
  getAllEvent,
  deleteEvent,
  getAllStudentsByClass,
  markStudents,
  isAttendanceMarked,
  checkAllStudentPayment,
  makeNewPayment,
  getPaymentHistory,
  getDashboardGraphData,
  // adminProfile,
} = require("../controllers/admin/app");
const {
  teacherRegisterValidation,
  studentRegisterValidation,
  adminRegisterValidation,
  adminLoginValidation,
  verifyAdmin,
  noticeValidator,
  eventValidator,
  verifyToken,
  paymentValidation,
} = require("../middlewares/admin/app");
const upload = require("../utils/multerConfig");

//Admin
router.post(
  "/register",
  upload.single("image"),
  adminRegisterValidation,
  adminRegister
);
router.post("/login", adminLoginValidation, adminLoginController);
router.post("/update-profile", verifyAdmin, changeAdminPassword);
router.post("/logout", adminLogoutController);

//Dashboard
// router.get("/profile", verifyAdmin, adminProfile);
router.get("/dashboard/get-all-count", verifyAdmin, getAllCount);

//Attendance
router.post("/attendance/mark-attendance", verifyAdmin, markStudents); //markAttendance
// router.get("/attendance/is-marked/:classID", verifyAdmin, isAttendanceMarked); // verify/checking for attendance marked or not
router.get("/attendance/:classID", verifyAdmin, getAllStudentsByClass); //get students by class for attendance

//Teacher
router.post(
  "/teacher/create-teacher",
  verifyAdmin,
  upload.single("image"),
  teacherRegisterValidation,
  createTeacher
);
router.get("/teacher/get-all-teachers", verifyAdmin, getAllTeachers);
router.patch("/teacher/update-teacher", verifyAdmin, updateTeacher);
router.delete("/teacher/delete-teacher/:teacherId", verifyAdmin, deleteTeacher);

//Student
router.post(
  "/student/create-student",
  verifyAdmin,
  upload.single("image"),
  studentRegisterValidation,
  createStudent
);
router.get("/student/get-all-students", verifyAdmin, getAllStudents);
router.patch("/student/update-student/:studentId", verifyAdmin, updateStudent);
// router.delete("/student/:studentId", verifyAdmin, deleteStudent);

//Notice
router.post(
  "/create-notice",
  verifyAdmin,
  upload.single("image"),
  noticeValidator,
  createNotice
);
router.get("/notice", getAllNotice);
router.delete("/notice/:noticeID", verifyAdmin, deleteNotice);

//Event
router.post(
  "/create-event",
  verifyAdmin,
  upload.single("image"),
  eventValidator,
  createEvent
);
router.get("/event", getAllEvent);
router.delete("/event/:eventID", verifyAdmin, deleteEvent);

//Class
router.post("/create-class", verifyAdmin, createClass);
router.get("/get-all-class", verifyAdmin, getAllClass);

//Search
router.get("/search", verifyAdmin, globalSearch);

//Gallery
router.post(
  "/gallery/add-images",
  verifyAdmin,
  upload.single("image"),
  addGalleryImage
);
router.get("/gallery/get-all-images", getAllImages);
router.delete("/gallery/delete-image/:id", verifyAdmin, deleteImage);

//Protected Route
router.get("/dashboard", verifyAdmin);
router.get("/teacher", verifyAdmin);
router.get("/student", verifyAdmin);

//Payment Routes
router.get("/get-all-student", verifyAdmin, checkAllStudentPayment);
router.post(
  "/payment/make-payment",
  verifyAdmin,
  paymentValidation,
  makeNewPayment
);
router.get("/payment/history", verifyAdmin, getPaymentHistory);
router.get("/earning", verifyAdmin, getDashboardGraphData);
// router.get("/checkPayment-of-students", verifyAdmin, getAllStudents);

//forget password for admin
router.post("/forget-password", forgetAdminPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
