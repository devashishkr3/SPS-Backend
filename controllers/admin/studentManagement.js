const Student = require("../../models/studentModel");
// const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const StudentClass = require("../../models/classModel");
const cloudinary = require("../../config/cloudinaryConfig");
const fs = require("fs-extra");
const upload = require("../../utils/multerConfig");
const sendEmailToAdmin = require("../../utils/emailToAdmin");
require("dotenv").config();

// Create student(CREATE)
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      // password,
      DOB,
      f_name,
      m_name,
      phone_no,
      whatsapp_no,
      conveyance_and_status,
      bus_trip,
      bus_no,
      aadhar_no,
      roll_no,
      admission_no,
      gender,
      address,
      DOA,
      residence_type,
      student_class,
    } = req.body;

    // console.log(payload);
    console.log(req.body);

    if (!req.file) {
      return res.status(404).json({
        message: "Student Image is Required",
        success: false,
      });
    }
    // creating StudentID using uuid
    const studentID = `SPS-${uuidv4().slice(0, 6).toUpperCase()}`;

    const existStudent = await Student.findOne({
      $or: [
        { admission_no },
        { aadhar_no },
        // { class_roll_no }
      ],
    });
    if (existStudent) {
      return res.status(409).json({
        message:
          "Student already exists with this admission number or aadhar no",
        success: false,
      });
    }

    const classData = await StudentClass.findOne({
      class_name: student_class,
    });
    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
        success: false,
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Student_Profile",
    });

    await fs.unlink(req.file.path);

    //hashing password for extra security
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashing ok");

    // try {
    const newStudent = new Student({
      name,
      email,
      // password: hashedPassword,
      studentID,
      DOB,
      f_name,
      m_name,
      phone_no,
      whatsapp_no,
      conveyance_and_status,
      bus_trip,
      bus_no,
      aadhar_no,
      roll_no,
      admission_no,
      gender,
      image: result.secure_url,
      imageID: result.public_id,
      DOA,
      address,
      residence_type,
      student_class: classData._id,
    });

    const savedStudent = await newStudent.save();
    // } catch (err) {
    // console.log("problem in saving studednt.", err);
    // }

    if (!savedStudent) {
      return res.status(400).json({
        message: "Student not created",
        success: false,
      });
    }

    classData.students.push(savedStudent._id);
    await classData.save();

    res.status(201).json({
      message: "Student Created SuccessFully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//get all students(READ)
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .populate("student_class")
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    if (!students) {
      res.status(404).json({
        message: "Students not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Students Found",
      success: true,
      data: students,
      pagination: {
        totalItems: total,
        currPage: page,
        totalPage: Math.ceil(total / limit),
        limit: limit,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Patch Update Student(UPDATE)
const updateStudent = async (req, res) => {
  try {
    // const { studentID } = req.params;
    const updateData = req.body;
    const studdID = updateData.studentID;

    console.log(req.body);

    if (!updateData.studentID) {
      return res.status(400).json({
        message: "StudentID is required",
        success: false,
      });
    }

    const searchedStudent = await Student.findOne({ studentID: studdID });

    console.log(searchedStudent);
    console.log(searchedStudent.id);
    if (!searchedStudent) {
      return res.status(404).json({
        message: "No Student Found With this StudentID",
        success: false,
      });
    }

    const updateStudent = await Student.findByIdAndUpdate(
      searchedStudent.id,
      updateData,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Student Updated Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { getAllStudents, createStudent, updateStudent }; // deleteStudent

//Post Delete Request(DELETE)
// const deleteStudent = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     if (!studentId) {
//       return res.status(400).json({
//         message: "Student ID not provided",
//         success: false,
//       });
//     }

//     // Find Student
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({
//         message: "Student not found",
//         success: false,
//       });
//     }

//     //Delete Image from Cloudinary
//     if (student.imageID) {
//       await cloudinary.uploader.destroy(student.imageID);
//     }

//     //Remove Student ID from Class
//     await StudentClass.findByIdAndUpdate(student.student_class, {
//       $pull: { students: studentId }, //  Student ID remove karega
//     });

//     //Delete Student
//     await Student.findByIdAndDelete(studentId);

//     res.status(200).json({
//       message: "Student deleted successfully",
//       success: true,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "An error occurred while deleting student",
//       success: false,
//     });
//   }
// };

// if (email) {
//   const subject =
//     " 🎉 Congratulations! Your Admission at SPS Barsoi is Confirmed";
//   const text = `Dear ${name},

//     Congratulations! 🎉 We are pleased to inform you that your admission to **SPS Barsoi** has been successfully confirmed.

//     Here are your admission details:

//     📌 **Student Name:** ${name}
//     📌 **Admission No:** ${admission_no}
//     📌 **Class Assigned:** ${student_class}
//     📌 **Roll Number:** ${roll_no}
//     📌 **Student ID:** ${studentID}

//     🔑 **Login Credentials (for School Portal):**
//     👤 **Username/StudentID :** ${studentID}
//     🔒 **Temporary Password:** ${password}

//     📢 Please change your password after the first login for security reasons.

//     ### **📚 Next Steps:**
//     ✔️ Keep this email safe for future reference.
//     ✔️ For any queries, contact the school administration.

//     For any assistance, feel free to reach out at **[School Contact Email]** or call **[School Contact Number]**.

//     Welcome to **[School Name]**! 🎓✨

//     Best regards,
//     **Principle**
//     SPS Barsoi
//     Barsoi Ghat , Barsoi
//     www.spsbarsoi.com
//     `;
//   sendEmailToAdmin(email, subject);
// }
