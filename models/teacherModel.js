const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    age: {
      type: Number,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be a valid 10-digit number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    DOJ: {
      //date of joining
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    teacherID: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "teacher",
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
