const Payment = require("../../models/paymentModel");
const Student = require("../../models/studentModel");

const checkAllStudentPayment = async (req, res) => {
  try {
    const students = await Student.find();
    if (!students) {
      return res.status(404).json({
        message: "Students Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Students Found",
      success: true,
      data: students,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

const makeNewPayment = async (req, res) => {
  try {
    // const { studentID } = req.params;
    const {
      studentID,
      name,
      studentClass,
      group,
      month,
      tuitionFee,
      bookFee,
      copyFee,
      dressFee,
      miscellaneous,
      totalAmount,
      receiptNo,
      paymentMethod,
    } = req.body;

    console.log(req.body);

    const student = await Student.findOne({ studentID });
    console.log(student);
    if (!student) {
      return res.status(404).json({
        message: "Student Not Fount With This StudentID",
        success: false,
      });
    }

    const payment = new Payment({
      studentId: student.id,
      name,
      studentClass,
      group,
      month,
      fees: {
        tuitionFee,
        bookFee,
        copyFee,
        dressFee,
        miscellaneous,
      },
      totalAmount,
      receiptNo,
      paymentMethod,
    });

    await payment.save();

    student.payments.push({
      month,
      year: new Date().getFullYear,
      status: "Paid",
      totalAmount,
      paidOn: new Date(),
    });

    await student.save();

    if (student.whatsapp_no) {
      const message = `Dear Parent , payment of ₹${totalAmount} has been received of 
      Student name :- ${student.name} 
      StudentID : ${student.studentID}
      Month : ${month}
      Receipt No : ${receiptNo}.
      Thank You ❤️!!`;

      console.log(message);

      // await clientInformation.message.create({
      //   from: WHATSAPP_NO,
      //   to: `whatsapp +91${student.whatsapp_no}`,
      //   body: message,
      // });
    }
    return res.status(201).json({
      message: "Payment Successful",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// 3️ Payment Report API (Daily, Monthly, Yearly Collection)
// const getPaymentHistory = async (req, res) => {
//   try {
//     const { filter } = req.query; // filter = "daily", "monthly", "yearly"

//     let matchStage = {};
//     if (filter === "daily") {
//       matchStage = {
//         paymentDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
//       };
//     } else if (filter === "monthly") {
//       const startOfMonth = new Date(
//         new Date().getFullYear(),
//         new Date().getMonth(),
//         1
//       );
//       matchStage = { paymentDate: { $gte: startOfMonth } };
//     } else if (filter === "yearly") {
//       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
//       matchStage = { paymentDate: { $gte: startOfYear } };
//     }

//     const totalCollection = await Payment.aggregate([
//       { $match: matchStage },
//       { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
//     ]);

//     return res.status(200).json({
//       message: "Payment Statistics",
//       success: true,
//       totalCollection: totalCollection[0]?.totalAmount || 0,
//     });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };

// const getPaymentHistory = async (req, res) => {
//   try {
//     let { filter, startDate, endDate } = req.query; // Query parameters

//     let matchStage = {};

//     if (filter === "daily") {
//       matchStage.paymentDate = {
//         $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today’s start time
//         $lt: new Date(new Date().setHours(23, 59, 59, 999)), // Today’s end time
//       };
//     } else if (filter === "monthly") {
//       const startOfMonth = new Date(
//         new Date().getFullYear(),
//         new Date().getMonth(),
//         1
//       );
//       const endOfMonth = new Date(
//         new Date().getFullYear(),
//         new Date().getMonth() + 1,
//         0
//       );
//       matchStage.paymentDate = { $gte: startOfMonth, $lt: endOfMonth };
//     } else if (filter === "yearly") {
//       const startOfYear = new Date(new Date().getFullYear(), 0, 1);
//       const endOfYear = new Date(new Date().getFullYear(), 11, 31);
//       matchStage.paymentDate = { $gte: startOfYear, $lt: endOfYear };
//     } else if (startDate && endDate) {
//       matchStage.paymentDate = {
//         $gte: new Date(startDate),
//         $lt: new Date(endDate),
//       };
//     }

//     const totalCollection = await Payment.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: null,
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ]);

//     const payments = await Payment.find(matchStage).sort({ paymentDate: -1 }); // Sorted by latest payment

//     return res.status(200).json({
//       message: "Payment Statistics",
//       success: true,
//       totalCollection: totalCollection[0]?.totalAmount || 0,
//       payments, // Returning payment history as well
//     });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };

// const getPaymentHistory = async (req, res) => {
//   try {
//     let { filter, startDate, endDate, year } = req.query;

//     let matchStage = {};

//     if (filter === "daily") {
//       matchStage.paymentDate = {
//         $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Aaj ka start time
//         $lte: new Date(new Date().setHours(23, 59, 59, 999)), // Aaj ka end time
//       };
//     } else if (filter === "monthly") {
//       const selectedYear = year ? parseInt(year) : new Date().getFullYear(); // Query se year lo ya current year le lo
//       const startOfMonth = new Date(selectedYear, new Date().getMonth(), 1);
//       const endOfMonth = new Date(
//         selectedYear,
//         new Date().getMonth() + 1,
//         0,
//         23,
//         59,
//         59,
//         999
//       );
//       matchStage.paymentDate = { $gte: startOfMonth, $lte: endOfMonth };
//       matchStage.year = selectedYear; // 🔹 Year bhi check karna zaroori hai
//     } else if (filter === "yearly") {
//       const selectedYear = year ? parseInt(year) : new Date().getFullYear();
//       const startOfYear = new Date(selectedYear, 0, 1);
//       const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
//       matchStage.paymentDate = { $gte: startOfYear, $lte: endOfYear };
//       matchStage.year = selectedYear;
//     } else if (startDate && endDate) {
//       matchStage.paymentDate = {
//         $gte: new Date(startDate),
//         $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // 🔹 Fixed end date logic
//       };
//     }

//     const totalCollection = await Payment.aggregate([
//       { $match: matchStage },
//       { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
//     ]);

//     const payments = await Payment.find(matchStage)
//       .sort({ paymentDate: -1 }) // 🔹 Latest-first sorting
//       .populate("studentId", "name studentID") // 🔹 Student details bhi la sakta hai
//       .populate("studentClass", "className"); // 🔹 Class ka naam bhi fetch kar sakta hai

//     return res.status(200).json({
//       message: "Payment Statistics",
//       success: true,
//       totalCollection: totalCollection[0]?.totalAmount || 0,
//       payments,
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };

const getPaymentHistory = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const last7Days = new Date(now.setDate(now.getDate() - 6));

    // 🟢 **Aggregation Query for Total Collections**
    const paymentStats = await Payment.aggregate([
      {
        $match: { paymentDate: { $gte: last7Days } },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          daily: {
            $push: {
              date: "$paymentDate",
              amount: "$totalAmount",
            },
          },
          weekly: {
            $push: {
              week: { $week: "$paymentDate" },
              amount: "$totalAmount",
            },
          },
          monthly: {
            $push: {
              month: { $month: "$paymentDate" },
              amount: "$totalAmount",
            },
          },
        },
      },
    ]);

    const totalCollection = paymentStats[0]?.totalAmount || 0;
    const dailyPayments = paymentStats[0]?.daily || [];
    const weeklyPayments = paymentStats[0]?.weekly || [];
    const monthlyPayments = paymentStats[0]?.monthly || [];

    // 🟢 **Fetch All Payments with Sorting**
    const payments = await Payment.find({ paymentDate: { $gte: last7Days } })
      .sort({ paymentDate: -1 })
      .populate("studentId", "name studentID")
      .populate("studentClass", "className");

    return res.status(200).json({
      message: "Payment Statistics",
      success: true,
      totalCollection,
      dailyPayments,
      weeklyPayments,
      monthlyPayments,
      payments,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { checkAllStudentPayment, makeNewPayment, getPaymentHistory };
