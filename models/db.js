const mongoose = require("mongoose");
require("dotenv").config();
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error("MONGO_URI is not defined in the .env file.");
  process.exit(1); // Exit if DB URI is missing
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if any error on DataBase
  });
async function main() {
  mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 30000,
  });
}
