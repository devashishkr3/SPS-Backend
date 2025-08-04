const Joi = require("joi");

const noticeValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),

    description: Joi.string().min(10).max(500).required().messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot exceed 500 characters",
      "any.required": "Description is required",
    }),

    date: Joi.date()
      .iso()
      .default(() => new Date())
      .messages({
        "date.base": "Date must be a valid date",
        "date.iso": "Date format must be ISO 8601",
      }),

    //   attachments: Joi.array().items(Joi.string().uri()).messages({
    //     "array.base": "Attachments must be an array",
    //     "string.uri": "Each attachment must be a valid URL",
    //   }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Validation Failed",
      success: false,
      errors: errorMessages,
    });
  }

  next();
};

module.exports = { noticeValidator };
