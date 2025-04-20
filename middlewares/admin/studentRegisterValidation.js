const Joi = require("joi");

// Middleware for student validation
const studentRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
    // password: Joi.string().min(6).required().messages({
    //   "string.empty": "Password is required.",
    //   "string.min": "Password must be at least 6 characters long.",
    // }),
    DOB: Joi.date().required().messages({
      "date.base": "DOB must be a valid date.",
      "any.required": "DOB is required.",
    }),
    f_name: Joi.string().required().messages({
      "string.empty": "Father's name is required.",
    }),
    m_name: Joi.string().required().messages({
      "string.empty": "Mother's name is required.",
    }),
    phone_no: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must be a valid 10-digit number.",
      }),
    whatsapp_no: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .messages({
        "string.pattern.base":
          "WhatsApp number must be a valid 10-digit number.",
      }),
    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address.",
    }),
    aadhar_no: Joi.string()
      .pattern(/^[0-9]{12}$/)
      .optional()
      .messages({
        "string.pattern.base": "Aadhar Number must be a valid 12-digit number.",
      }),
    student_class: Joi.string().required().messages({
      "string.empty": "Class is required.",
    }),
    roll_no: Joi.number().integer().required().messages({
      "number.base": "Roll number must be a valid number.",
      "any.required": "Roll number is required.",
    }),
    bus_no: Joi.string().optional(),
    bus_trip: Joi.string().optional(),
    conveyance_and_status: Joi.string()
      .valid("Hostel", "Yes", "No", "Teacher's Ward", "Pass Out", "Left")
      .required()
      .messages({
        "any.only": "Invalid conveyance status.",
        "string.empty": "Conveyance status is required.",
      }),
    admission_no: Joi.number().integer().required().messages({
      "number.base": "Admission number must be a valid number.",
      "any.required": "Admission number is required.",
    }),
    gender: Joi.string()
      .valid("Male", "Female", "ThirdGender")
      .required()
      .messages({
        "any.only": "Gender must be one of Male, Female, or ThirdGender.",
        "string.empty": "Gender is required.",
      }),
    DOA: Joi.date().default(Date.now),
    address: Joi.string().required().messages({
      "string.empty": "Address is required.",
    }),
    // fixedFees: Joi.object({
    // tuitionFee: Joi.number().default(0),
    // busCharge: Joi.number().default(0),
    // hostelFee: Joi.number().default(0),
    // miscellaneous: Joi.number().default(0),
    // // }),
    // totalAmount: Joi.number().default(0),
  });

  // Validate request body
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      errors: errorMessages,
    });
  }

  next();
};

module.exports = { studentRegisterValidation };
