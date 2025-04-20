const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const JWT_SECRET = process.env.JWT_SECRET;

//student login check
const studentLoginAuth = (req, res, next) => {
  const schema = Joi.object({
    studentID: Joi.string().required().messages({
      "string.empty": "StudentID is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  next();
};

// verify jwt and student
const verifyStudentToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, No Token Provided", success: false });
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);

    const student = await Student.findById(decoded.id).select("-password"); // Fetch student without password
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found", success: false });
    }

    req.student = student; // Save student details in request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
};

module.exports = { studentLoginAuth, verifyStudentToken };
