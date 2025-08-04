const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    name: { type: String, required: true },
    studentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentClass",
      required: true,
    }, // 🔹 Fixed
    group: {
      type: String,
      required: true,
      enum: ["Kids", "Junior", "Pre-Senior", "Senior"],
    },
    month: { type: String, required: true },
    year: { type: Number, required: true }, // 🔹 Fixed
    fees: {
      tuitionFee: { type: Number, default: 0 },
      bookFee: { type: Number, default: 0 },
      copyFee: { type: Number, default: 0 },
      dressFee: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
    },
    totalAmount: { type: Number, required: true },
    receiptNo: { type: String, required: true }, // 🔹 Unique hata diya agar student-wise generate ho raha hai
    paymentDate: { type: Date, default: null },
    paymentMethod: {
      type: String,
      enum: ["Offline", "Online"],
      default: "Offline",
    },
  },
  { timestamps: true } // 🔹 createdAt aur updatedAt auto ho jayega
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
