const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const BlacklistedToken = require("../../models/blacklistedToken");

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Access Denied , No Token Provided",
        success: false,
      });
    }
    // console.log(token);

    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been blacklisted. Please login again.",
        success: false,
      });
    }

    const decode = jwt.verify(token.replace("Bearer", " "), JWT_SECRET);

    // console.log(decode);

    if (decode.role !== "admin") {
      return res.status(403).json({
        message: "Access Forbidden! Only Admins Allowed",
        success: false,
      });
    }
    req.user = decode;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

module.exports = { verifyAdmin };
