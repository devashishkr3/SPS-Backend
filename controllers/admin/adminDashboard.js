const Student = require("../../models/studentModel");
const Teacher = require("../../models/teacherModel");
const Admin = require("../../models/adminModel");
const StudentClass = require("../../models/classModel");
const Gallery = require("../../models/galleryModel");

const getAllCount = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalClasses = await StudentClass.countDocuments();
    const galleryImages = await Gallery.countDocuments();

    // Gender-wise student count
    const totalBoys = await Student.countDocuments({ gender: "Male" });
    const totalGirls = await Student.countDocuments({ gender: "Female" });
    const totalThirdGender = await Student.countDocuments({
      gender: "ThirdGender",
    });

    return res.status(200).json({
      message: "Total Count Found",
      success: true,
      data: {
        totalTeachers,
        totalStudents,
        totalClasses,
        galleryImages,
        totalBoys,
        totalGirls,
        totalThirdGender,
      },
    });
  } catch (err) {
    return res.status(500).jsno({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// const adminProfile = async (req, res) => {
//   try {
//     const admin = await Admin.find({})
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success : false,
//     })
//   }
// }

module.exports = { getAllCount };
