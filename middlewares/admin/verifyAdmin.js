const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Access Denied , No Token Provided",
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
    // console.log(decode);
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

// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const JWT_SECRET = process.env.JWT_SECRET;
// const client = require("../../config/redishClient"); // Redis Client Import

// const verifyAdmin = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ message: "Access Denied, No Token Provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract JWT Token

//   // 🔹 Check if token is blacklisted
//   const isBlacklisted = await client.get(token);
//   if (isBlacklisted) {
//     return res
//       .status(403)
//       .json({ message: "Token Blacklisted, Please Login Again" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);

//     if (decoded.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access Forbidden! Only Admins Allowed" });
//     }

//     req.user = decoded; // Store admin details in request
//     next(); // Move to next middleware
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid Token" });
//   }
// };

// module.exports = { verifyAdmin };
