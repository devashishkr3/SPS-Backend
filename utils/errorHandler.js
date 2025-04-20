// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message); // Log error message for debugging

  const statusCode = err.statusCode || 500; // Default to 500 (Internal Server Error)
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
