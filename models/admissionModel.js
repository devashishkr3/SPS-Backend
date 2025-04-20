const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  student_name: {
    type: String,
    required: true,
  },
  parent_name: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
  choose_class: {
    type: string,
    required: true,
    enum: [
      "nursery",
      "L.K.G",
      "U.K.G",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ],
  },
  DOB: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
  },
});

const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;
