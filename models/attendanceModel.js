const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  classId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    required: true,
  },
  isMarked: {
    type: Boolean,
    default: false,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
