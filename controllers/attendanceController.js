const express = require("express");
const axios = require("axios");
const Student = require("../models/studentModel");
const Attendance = require("../models/attendanceModel");
const StudentClass = require("../models/classModel");
const allStudents = [];

// const getAllStudentsByClass = async (req, res) => {
//   try {
//     const { classID } = req.params;
//     if (!classID) {
//       return res.status(400).json({
//         message: "ClassID is Required",
//         success: false,
//       });
//     }
//     const students = await Student.find({ student_class: classID });
//     if (!students) {
//       return res.status(404).json({
//         message: "Students Not Found",
//         success: false,
//       });
//     }
//     const filteredStudents = students.map((student) => ({
//       name: student.name,
//       roll_no: student.roll_no,
//       studentID: student.studentID,
//     }));
//     return res.status(200).json({
//       message: "Students Fount",
//       success: true,
//       data: filteredStudents,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

exports.isAttendanceMarked = async (req, res) => {
  try {
    const { classId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const marked = await Attendance.findOne({
      classId,
      date: today,
      isMarked: true,
    });

    return res.status(200).json({
      success: true,
      alreadyMarked: !!marked,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

exports.getAllStudentsByClass = async (req, res) => {
  try {
    const { classID } = req.params;
    // console.log(classID);
    if (!classID) {
      return res.status(400).json({
        message: "ClassID is required",
        success: false,
      });
    }

    const classData = await StudentClass.findById(classID).populate("students");
    if (!classData) {
      return res.status(404).json({
        message: "No Student Found In this Class",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Student Found",
      success: true,
      data: classData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

exports.markStudents = async (req, res) => {
  try {
    const { classId, attendanceData, isMarked } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!classId || !attendanceData) {
      return res.status(400).json({
        message: "class ID and Attendance Data is mandatory",
        success: false,
      });
    }

    const existAttendance = await Attendance.findOne({
      classId,
      date: today,
      isMarked: true,
    });
    if (existAttendance) {
      return res.status(400).json({
        message: "Attandence Already Recorder for Today!",
        success: false,
      });
    }

    for (let student of attendanceData) {
      // console.log(student);

      const studd = await Student.findOne({ studentID: student.Id });
      // console.log(studd.id);

      await Attendance.create({
        studentId: studd.id,
        classId,
        date: today,
        status: student.status,
      });

      if (student.status == "Absent") {
        console.log("student is absent");
        const studentInfo = await Student.findOne({ studentID: student.Id });
        if (!studentInfo) {
          return res.status(404).json({
            message: "Student Info not found for Absent Student",
            success: false,
          });
        }

        allStudents.push(studentInfo);

        if (!studentInfo.whatsapp_no) {
          console.log(studentInfo.phone_no);
        }
        // const parentPhone = studentInfo.whatsapp_no;

        // console.log(parentPhone);

        // ------------------------------whatsapp msg ------------------------//
      }
    }

    return res.status(200).json({
      message: "Attendance Marked Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// module.exports = { getAllStudentsByClass, markStudents, isAttendanceMarked };

// await axios.post("https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages", {
//               messaging_product: "whatsapp",
//               to: parentPhone,
//               type: "text",
//               text: {
//                   body: `Your child ${studentInfo.name} (ID: ${studentInfo.studentId}, Roll: ${studentInfo.rollNo}) is absent today.`
//               }
//           }, {
//               headers: {
//                   "Authorization": `Bearer YOUR_ACCESS_TOKEN`,
//                   "Content-Type": "application/json"
//               }
//           });
