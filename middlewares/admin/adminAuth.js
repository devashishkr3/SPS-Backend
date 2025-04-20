const Joi = require("joi");

//Middleware for admin Register validation
const adminRegisterValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required.",
      "string.email": "Email must be a valid email address.",
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

// Middleware for admin login validation
const adminLoginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format.",
      "string.empty": "Email cannot be empty.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
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

module.exports = {
  adminRegisterValidation,
  adminLoginValidation,
};
