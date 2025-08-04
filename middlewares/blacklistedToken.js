const BlacklistedToken = require("../models/blacklistedToken");

const checkBlacklistedToken = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been blacklisted. Please login again.",
        success: false,
      });
    }

    next(); // token is valid and not blacklisted
  } catch (err) {
    return res.status(500).json({
      message: "Error while verifying token",
      success: false,
    });
  }
};

module.exports = { checkBlacklistedToken };
