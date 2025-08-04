const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const adminRoute = require("./routes/adminRoute");
const schoolRoute = require("./routes/schoolRoute");
const errorHandler = require("./utils/errorHandler");

// Load ENVIRONMENT Variable (.env)
require("dotenv").config();

// Load DB
require("./models/db");

// Load Corn
require("./utils/cornSheduler");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

const allowedOrigins = [];
// Whitelist your frontend domain
if (process.env.NODE_ENV === "production") {
  allowedOrigins = [process.env.FRONTEND_URL, "*"];
} else if (process.env.NODE_ENV === "development") {
  allowedOrigins = ["http://localhost:5173"];
}

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
app.use("/admin", adminRoute);
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "API working properly",
    success: true,
  });
});

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
