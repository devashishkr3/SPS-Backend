const jwt = require("jsonwebtoken");
const Teacher = require("../../models/teacherModel");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

//Teacher Login
const teacherLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password is Required",
        success: false,
      });
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(403).json({
        message: "Teacher with this Email doesn't Exist",
        success: false,
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, teacher.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Password",
        success: false,
      });
    }

    //Generate jwt Token
    const token = jwt.sign(
      {
        id: teacher._id,
        email: teacher.email,
        name: teacher.name,
        role: teacher.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    //Sending response
    return res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
      redirect: "/teacher",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

//change password using old password
const changeTeacherPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const teacherId = req.teacher.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old Password and New Password is required",
        success: false,
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(400).json({
        message: "Teacher not found",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      teacher.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid Password",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    teacher.password = hashedPassword;
    await teacher.save();

    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "an error occured while cahnging the password ",
      success: false,
    });
  }
};

//forget Password

module.exports = {
  teacherLoginController,
  changeTeacherPassword,
};
