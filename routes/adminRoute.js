const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const adminDashboard = require("../controllers/adminDashboard");
const adminManagementController = require("../controllers/adminManagementController");
const attendanceController = require("../controllers/attendanceController");
const contactUsController = require("../controllers/contactUsController");
const eventManagement = require("../controllers/eventManagement");
const forgetAdminPassword = require("../controllers/forgetAdminPassword");
const galleryManagement = require("../controllers/galleryManagement");
const noticeManagement = require("../controllers/noticeManagement");
const paymentController = require("../controllers/paymentController");
const studentManagement = require("../controllers/studentManagement");
const teacherManagement = require("../controllers/teacherManagement");
const earningController = require("../controllers/earningController");
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
} = require("../middlewares/app");
const upload = require("../utils/multerConfig");

//Admin
router.post(
  "/register",
  upload.single("image"),
  adminRegisterValidation,
  adminAuthController.adminRegister
);
router.post(
  "/login",
  adminLoginValidation,
  adminAuthController.adminLoginController
);
router.post(
  "/update-profile",
  verifyAdmin,
  adminAuthController.changeAdminPassword
);
router.post("/logout", adminAuthController.adminLogoutController);

//Dashboard
// router.get("/profile", verifyAdmin, adminProfile);
router.get("/dashboard/get-all-count", verifyAdmin, adminDashboard.getAllCount);

//Attendance
router.post(
  "/attendance/mark-attendance",
  verifyAdmin,
  attendanceController.markStudents
); //markAttendance
// router.get("/attendance/is-marked/:classID", verifyAdmin, isAttendanceMarked); // verify/checking for attendance marked or not
router.get(
  "/attendance/:classID",
  verifyAdmin,
  attendanceController.getAllStudentsByClass
); //get students by class for attendance

//Teacher
router.post(
  "/teacher/create-teacher",
  verifyAdmin,
  upload.single("image"),
  teacherRegisterValidation,
  teacherManagement.createTeacher
);
router.get(
  "/teacher/get-all-teachers",
  verifyAdmin,
  teacherManagement.getAllTeachers
);
router.patch(
  "/teacher/update-teacher",
  verifyAdmin,
  teacherManagement.updateTeacher
);
router.delete(
  "/teacher/delete-teacher/:teacherId",
  verifyAdmin,
  teacherManagement.deleteTeacher
);

//Student
router.post(
  "/student/create-student",
  verifyAdmin,
  upload.single("image"),
  studentRegisterValidation,
  studentManagement.createStudent
);
router.get(
  "/student/get-all-students",
  verifyAdmin,
  studentManagement.getAllStudents
);
router.patch(
  "/student/update-student/:studentId",
  verifyAdmin,
  studentManagement.updateStudent
);
// router.delete("/student/:studentId", verifyAdmin, studentManagement.deleteStudent);

//Notice
router.post(
  "/create-notice",
  verifyAdmin,
  upload.single("image"),
  noticeValidator,
  noticeManagement.createNotice
);
router.get("/notice", noticeManagement.getAllNotice);
router.delete("/notice/:noticeID", verifyAdmin, noticeManagement.deleteNotice);

//Event
router.post(
  "/create-event",
  verifyAdmin,
  upload.single("image"),
  eventValidator,
  eventManagement.createEvent
);
router.get("/event", eventManagement.getAllEvent);
router.delete("/event/:eventID", verifyAdmin, eventManagement.deleteEvent);

//Class
router.post(
  "/create-class",
  verifyAdmin,
  adminManagementController.createClass
);
router.get(
  "/get-all-class",
  verifyAdmin,
  adminManagementController.getAllClass
);

//Search
router.get("/search", verifyAdmin, adminManagementController.globalSearch);

//Gallery
router.post(
  "/gallery/add-images",
  verifyAdmin,
  upload.single("image"),
  galleryManagement.addGalleryImage
);
router.get("/gallery/get-all-images", galleryManagement.getAllImages);
router.delete(
  "/gallery/delete-image/:id",
  verifyAdmin,
  galleryManagement.deleteImage
);

//Protected Route
router.get("/dashboard", verifyAdmin);
router.get("/teacher", verifyAdmin);
router.get("/student", verifyAdmin);

//Payment Routes
// router.get("/get-all-student", verifyAdmin, checkAllStudentPayment);
// router.post(
//   "/payment/make-payment",
//   verifyAdmin,
//   paymentValidation,
//   makeNewPayment
// );
// router.get("/payment/history", verifyAdmin, getPaymentHistory);
// router.get("/earning", verifyAdmin, getDashboardGraphData);
// router.get("/checkPayment-of-students", verifyAdmin, getAllStudents);

router.put("/pay/:id", paymentController.markAsPaid);
router.get("/student/:id/unpaid", paymentController.getUnpaidPayments);
router.get("/dashboard/summary", paymentController.getDashboardStats);

//forget password for admin
router.post("/forget-password", forgetAdminPassword.forgetAdminPassword);
router.post("/verify-otp", forgetAdminPassword.verifyOTP);
router.post("/reset-password", forgetAdminPassword.resetPassword);

module.exports = router;
