const Joi = require("joi");

// Middleware for teacher validation
const teacherRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
    }),
    age: Joi.number().integer().required().messages({
      "number.base": "Age must be a number.",
    }),
    subject: Joi.string().required().messages({
      "string.empty": "Subject is required.",
    }),
    phone_no: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required.",
        "string.pattern.base": "Phone number must be a valid 10-digit number.",
      }),
    DOJ: Joi.date().required().messages({
      "date.base": "DOJ must be a valid date.",
      "any.required": "DOJ is required.",
    }),
    gender: Joi.string()
      .valid("Male", "Female", "ThirdGender")
      .required()
      .messages({
        "any.only": "Gender must be one of Male, Female, or ThirdGender.",
        "string.empty": "Gender is required.",
      }),
    image: Joi.string().uri().optional().messages({
      "string.uri": "Image must be a valid URL.",
    }),
    qualification: Joi.string().required().messages({
      "string.empty": "Qualification is required.",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address is required.",
    }),
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

module.exports = { teacherRegisterValidation };
