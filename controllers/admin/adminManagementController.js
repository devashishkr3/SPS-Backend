const Teacher = require("../../models/teacherModel");
const Student = require("../../models/studentModel");
const StudentClass = require("../../models/classModel");

const JWT_SECRET = process.env.JWT_SECRET;

//Get Global Search
const globalSearch = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(404).json({
        message: "search Query is empty or not found.",
        success: false,
      });
    }

    const [teacher, student] = await Promise.all([
      Teacher.find({
        $or: [
          { name: { $regex: `${search}`, $options: "i" } },
          { subject: { $regex: `${search}`, $options: "i" } },
          { email: { $regex: `${search}`, $options: "i" } },
        ],
      }),
      Student.find({
        $or: [
          { name: { $regex: `${search}`, $options: "i" } },
          { email: { $regex: `${search}`, $options: "i" } },
          { session: { $regex: `${search}`, $options: "i" } },
        ],
      }),
    ]);

    if (!teacher || !student) {
      return res.status(404).json({
        message: "No Data Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Teacher Found",
      success: true,
      data: [teacher, student],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occured while fetching teachers",
      success: false,
    });
  }
};

const createClass = async (req, res) => {
  try {
    const { class_name } = req.body;

    if (!class_name) {
      return res.status(400).json({
        message: "enter class_name",
        success: false,
      });
    }

    const checkClass = await StudentClass.findOne({ class_name });
    if (checkClass) {
      return res.status(409).json({
        message: "Class Already Exist",
        success: false,
      });
    }

    const newClass = new StudentClass({
      class_name,
    });

    const savedClass = await newClass.save();
    if (!savedClass) {
      return res.status(400).json({
        message: "Class not created",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Class created successfully",
      success: true,
      data: savedClass,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllClass = async (req, res) => {
  try {
    const classes = await StudentClass.find();

    if (!classes) {
      return res.status(404).json({
        message: "Classes Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Classes Found",
      success: true,
      data: classes,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// const getAllStudentsByClass = async (req, res) => {
//   try {
//     const { classID } = req.params;
//     if (!classID) {
//       return res.status(400).json({
//         message: "ClassID is required",
//         success: false,
//       });
//     }

//     const classData = await StudentClass.findById(classID);
//     if (!classData) {
//       return res.status(404).json({
//         message: "No Student Found In this Class",
//         success: false,
//       });
//     }

//     return res.status(200).json({
//       message: "Student Found",
//       success: true,
//       data: classData,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

module.exports = {
  createClass,
  globalSearch,
  getAllClass,
  // getAllStudentsByClass,
};
