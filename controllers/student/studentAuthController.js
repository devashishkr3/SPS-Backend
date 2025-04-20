//
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../../models/studentModel");
const JWT_SECRET = process.env.JWT_SECRET;

// Student Login
const studentLoginController = async (req, res) => {
  try {
    const { studentID, password } = req.body;
    console.log(req.body);
    if (!studentID || !password) {
      return res.status(400).json({
        message: "Email and Password are Required",
        success: false,
      });
    }
    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(403).json({
        message: "Student with this Student ID doesn't exist",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, student.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Password",
        success: false,
      });
    }

    //Generate jwt Token
    const token = jwt.sign(
      {
        id: student._id,
        studentID: student.studentID,
        name: student.name,
        role: student.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    //sending response
    return res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
      redirect: "/student",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// change password in login using old password
const changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const studentID = req.student.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old and New Password are required",
        success: false,
      });
    }
    const student = await Student.findById(studentID);
    if (!student) {
      return res.status(400).json({
        message: "student not found",
        success: false,
      });
    }
    // checking password
    const isPasswordCorrect = bcrypt.compare(oldPassword, student.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "old password is incorrect",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    return res.status(200).json({
      message: "password changed successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "an error occured while changing the password",
      success: false,
    });
  }
};

//Forget Password

module.exports = {
  studentLoginController,
  changeStudentPassword,
};
