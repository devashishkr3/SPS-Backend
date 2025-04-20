const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied, No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = { verifyToken };

// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const JWT_SECRET = process.env.JWT_SECRET;
// const client = require("../../config/redishClient"); // Redis Client Import

// const verifyToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ message: "Access Denied, No Token Provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract JWT Token

//   // 🔹 Check if token is blacklisted in Redis
//   const isBlacklisted = await client.get(token);
//   if (isBlacklisted) {
//     return res
//       .status(403)
//       .json({ message: "Token Blacklisted, Please Login Again" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // Save decoded data to request
//     next(); // Move to next middleware
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid Token" });
//   }
// };

// module.exports = { verifyToken };
