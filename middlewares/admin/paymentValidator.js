const Joi = require("joi");

const paymentValidation = (req, res, next) => {
  const schema = Joi.object({
    studentID: Joi.string().required().messages({
      "string.empty": "Student ID is required.",
    }),
    name: Joi.string().required().messages({
      "string.empty": "Student name is required.",
    }),
    studentClass: Joi.string().required().messages({
      "string.empty": "Class is required.",
    }),
    group: Joi.string().optional().allow("").messages({
      "string.base": "Group must be a string.",
    }),
    month: Joi.string().required().messages({
      "string.empty": "Month is required.",
    }),
    tuitionFee: Joi.number().min(0).required().messages({
      "number.base": "Tuition Fee must be a number.",
      "any.required": "Tuition Fee is required.",
    }),
    bookFee: Joi.number().min(0).required().messages({
      "number.base": "Book Fee must be a number.",
      "any.required": "Book Fee is required.",
    }),
    copyFee: Joi.number().min(0).required().messages({
      "number.base": "Copy Fee must be a number.",
      "any.required": "Copy Fee is required.",
    }),
    dressFee: Joi.number().min(0).required().messages({
      "number.base": "Dress Fee must be a number.",
      "any.required": "Dress Fee is required.",
    }),
    miscellaneous: Joi.number().min(0).required().messages({
      "number.base": "Miscellaneous must be a number.",
      "any.required": "Miscellaneous is required.",
    }),
    totalAmount: Joi.number().min(0).required().messages({
      "number.base": "Total Amount must be a number.",
      "any.required": "Total Amount is required.",
    }),
    receiptNo: Joi.string().required().messages({
      "string.empty": "Receipt Number is required.",
    }),
    paymentMethod: Joi.string().valid("Offline", "Online").required().messages({
      "any.only":
        "Invalid payment method. Must be one of cash, online, upi, bank, card.",
      "string.empty": "Payment method is required.",
    }),
    year: Joi.string().required().messages({
      "string.empty": "year is required.",
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

module.exports = { paymentValidation };
