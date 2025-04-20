const Teacher = require("../../models/teacherModel");
// const bcrypt = require("bcrypt");
const cloudinary = require("../../config/cloudinaryConfig");
const fs = require("fs-extra");
const upload = require("../../utils/multerConfig");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

// Create teacher
const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      // password,
      age,
      subject,
      phone_no,
      DOJ,
      gender,
      qualification,
      address,
    } = req.body;

    if (!req.file) {
      return res.status(404).json({
        message: "Teacher Image is Required",
        success: false,
      });
    }

    const existTeacher = await Teacher.findOne({ email });
    if (existTeacher) {
      return res.status(409).json({
        message: "Teacher Exist.",
        success: false,
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "SPS/Teacher_Profile",
    });

    if (!result) {
      return res.status(500).json({
        message: "Some Error to upload Image",
        success: false,
      });
    }

    await fs.unlink(req.file.path);

    //hashing password for extra security
    // const hashedPassword = await bcrypt.hash(password, 10);

    const teacherID = `SPS-TR-${uuidv4().slice(0, 6).toUpperCase()}`;

    //creating new Teacher
    const newTeacher = new Teacher({
      name,
      email,
      // password: hashedPassword,
      teacherID,
      address,
      age,
      subject,
      phone_no,
      DOJ,
      gender,
      qualification,
      image: result.secure_url,
      imageID: result.public_id,
    });

    try {
      await newTeacher.save();
    } catch (err) {
      console.log(err);
    }
    res.status(200).json({
      message: "Teacher Created SuccessFully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//Get all teachers

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    if (!teachers) {
      res.status(404).json({
        message: "No Teacher Found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Teachers Found",
      success: true,
      data: teachers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "An error occured while fetching teachers",
      success: false,
    });
  }
};

//update Teacher
const updateTeacher = async (req, res) => {
  try {
    const { teacherID } = req.params;
    const { updatedData } = req.body;

    const teacher = await Teacher.findById(teacherID);
    if (!teacher) {
      res.status(404).json({
        message: "Teacher Not Found",
        success: false,
      });
    }

    const updateTeacher = await Teacher.findByIdAndUpdate(
      teacherID,
      updatedData,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Teacher Updated Successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(404).json({
        message: "TeacherId Not Found",
        success: false,
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found with this Id",
        success: false,
      });
    }

    if (teacher.imageID) {
      await cloudinary.uploader.destroy(teacher.imageID);
    }

    await Teacher.findByIdAndDelete(teacherId);

    return res.status(200).json({
      message: "Teacher Successfully Deleted",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occured on deleting Teacher",
      success: false,
    });
  }
};

module.exports = {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
