const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const StudentClass = mongoose.model("StudentClass", studentClassSchema);

module.exports = StudentClass;
