const {
  adminRegisterValidation,
  adminLoginValidation,
} = require("./adminAuth");
const { teacherRegisterValidation } = require("./teacherRegisterValidation");
const { studentRegisterValidation } = require("./studentRegisterValidation");
const { verifyAdmin } = require("./verifyAdmin");
const { noticeValidator } = require("./noticeValidator");
const { eventValidator } = require("./eventValidator");
const { verifyToken } = require("./verifyToken");
const { paymentValidation } = require("./paymentValidator");
const { checkBlacklistedToken } = require("./blacklistedToken");

module.exports = {
  adminRegisterValidation,
  adminLoginValidation,
  teacherRegisterValidation,
  studentRegisterValidation,
  verifyAdmin,
  noticeValidator,
  eventValidator,
  verifyToken,
  paymentValidation,
  checkBlacklistedToken,
};
