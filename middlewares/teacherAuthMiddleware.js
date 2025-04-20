const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");
const JWT_SECRET = process.env.JWT_SECRET;

//
const teacherLoginAuth = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required.",
        "string.email": "Please provide a valid email address.",
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

const verifyTeacherToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
        success: false,
      });
    }

    const decoded = jwt.verify(token.replace("Bearer", ""), JWT_SECRET);

    const teacher = await Teacher.findById(decoded.id).select("-password");
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
        success: false,
      });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

module.exports = { teacherLoginAuth, verifyTeacherToken };
