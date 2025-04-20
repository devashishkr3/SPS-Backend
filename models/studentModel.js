const { required } = require("joi");
const moment = require("moment");
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    DOB: {
      type: Date,
      required: true,
    },
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    residence_type: {
      type: String,
      required: true,
      enum: ["day_scholar", "hosteller"],
    },
    f_name: {
      type: String,
      required: true,
    },
    m_name: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be a 10-digit number"],
    },
    whatsapp_no: {
      type: String,
      match: [/^\d{10}$/, "Mobile number must be a 10-digit number"],
    },
    email: {
      type: String,
      // required: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    aadhar_no: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: (value) => {
          return !value || /^\d{12}$/.test(value);
        },
        message: "Aadhar Number must be valid 12-digit number",
      },
    },
    student_class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentClass",
      required: true,
    },
    roll_no: {
      type: Number,
      required: true,
    },
    bus_no: {
      type: String,
    },
    bus_trip: {
      type: String,
    },
    conveyance_and_status: {
      type: String,
      required: true,
      enum: ["Hostel", "Yes", "No", "Teacher's Ward", "Pass Out", "Left"],
    },
    admission_no: {
      type: Number,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "ThirdGender"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageID: {
      type: String,
      unique: true,
      required: true,
    },
    DOA: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },

    fixedFees: {
      tuitionFee: { type: Number, default: 0 },
      busCharge: { type: Number, default: 0 },
      hostelFee: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
      lateFee: { type: Number, default: 0 },
      computer: { type: Number, default: 0 },
      smartClass: { type: String, default: 0 },
    },

    payments: [
      {
        month: { type: String, required: true },
        year: { type: Number, required: true },
        status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
        totalAmount: { type: Number, default: 0 },
        paidOn: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// **Pre-Save Hook to Add Default Fee Payment Entry**
studentSchema.pre("save", function (next) {
  if (this.isNew) {
    const currentMonth = moment().format("MMMM"); // Current month
    const currentYear = moment().year(); // Current year

    if (this.fixedFees) {
      let totalAmount =
        this.payments.length > 0 ? this.payments[0].totalAmount : null;

      if (!totalAmount) {
        totalAmount =
          (this.fixedFees.tuitionFee || 0) +
          (this.fixedFees.busCharge || 0) +
          (this.fixedFees.hostelFee || 0) +
          (this.fixedFees.miscellaneous || 0);
      }

      this.payments.push({
        month: currentMonth,
        year: currentYear,
        status: "unpaid",
        totalAmount: totalAmount,
        paidOn: null,
      });
    }
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
