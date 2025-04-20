const moment = require("moment");
const Payment = require("../../models/paymentModel");

const getDashboardGraphData = async (req, res) => {
  try {
    const { range, group } = req.query; // daily, weekly, monthly + group = Kids, Junior etc.
    console.log(req.query);

    const matchStage = {};

    // Filter group-wise
    if (group) {
      matchStage.group = group;
    }

    const now = new Date();

    if (range === "daily") {
      const start = moment().startOf("day").toDate();
      const end = moment().endOf("day").toDate();

      matchStage.paymentDate = { $gte: start, $lte: end };

      const data = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $hour: "$paymentDate" },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.status(200).json({ success: true, label: "hour", data });
    }

    if (range === "weekly") {
      const start = moment().startOf("isoWeek").toDate();
      const end = moment().endOf("isoWeek").toDate();

      matchStage.paymentDate = { $gte: start, $lte: end };

      const data = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dayOfWeek: "$paymentDate" },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.status(200).json({ success: true, label: "day", data });
    }

    if (range === "monthly") {
      const start = moment().startOf("month").toDate();
      const end = moment().endOf("month").toDate();

      matchStage.paymentDate = { $gte: start, $lte: end };

      const data = await Payment.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dayOfMonth: "$paymentDate" },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.status(200).json({ success: true, label: "date", data });
    }

    // Default fallback
    return res.status(400).json({
      success: false,
      message: "Invalid range provided",
    });
  } catch (err) {
    console.error("Dashboard Graph Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { getDashboardGraphData };
