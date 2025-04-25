const express = require("express");
require("dotenv").config();
require("./models/db");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const adminRoute = require("./routes/adminRoute");
const studentRoute = require("./routes/studentRoute");
const teacherRoute = require("./routes/teacherRoute");
const schoolRoute = require("./routes/schoolRoute");
const errorHandler = require("./utils/errorHandler");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// Whitelist your frontend domain
const allowedOrigins = [
  "https://school-management-fqyzvx3ed-devashishkr3s-projects.vercel.app",
  // "http://localhost:5173",
  "https://school-management-eta-one.vercel.app",
];
// Add production domain when deploying

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies & authentication headers
  })
);

app.use("/school", schoolRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);
app.use("/admin", adminRoute);
// app.use("/admission");

// Handle Invalid Routes
app.get("*", (req, res) => {
  res.status(404).json({
    message: "Route doesn't exist / page not found.",
    success: false,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
