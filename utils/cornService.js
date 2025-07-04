const cron = require("node-cron");
const Student = require("./models/Student");
const moment = require("moment");
// const sendMessage = require("./sendMessage"); // Function to send message (Twilio WhatsApp API ya SMS)

// 🛠 1st Date ko unpaid status update karne wala CRON job
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Running Monthly Fee Updater...");

    const currentMonth = moment().format("MMMM");
    const currentYear = moment().year();

    const students = await Student.find();

    for (const student of students) {
      const existingPayment = student.payments.find(
        (payment) =>
          payment.month === currentMonth && payment.year === currentYear
      );

      if (!existingPayment) {
        student.payments.push({
          month: currentMonth,
          year: currentYear,
          status: "unpaid",
          totalAmount: student.monthlyFee, // Student ka actual monthly fee
        });

        await student.save();
        console.log(`Updated fees for: ${student.name} (${student.studentID})`);
      }
    }

    console.log("Monthly fee update completed successfully.");
  } catch (error) {
    console.error("Error updating monthly fees:", error);
  }
});

// 🛠 5th Date ko Unpaid Students ko Message bhejne wala CRON job
cron.schedule("0 0 5 * *", async () => {
  try {
    console.log("Running Monthly Fee Reminder...");

    const students = await Student.find();

    for (const student of students) {
      const unpaidMonths = student.payments.filter(
        (payment) => payment.status === "unpaid"
      );

      if (unpaidMonths.length > 0) {
        const pendingMonths = unpaidMonths.map((p) => p.month).join(", ");
        const totalPendingAmount = unpaidMonths.reduce(
          (sum, p) => sum + p.totalAmount,
          0
        );

        const message = `Dear ${student.name},\nYour fee for ${pendingMonths} (${totalPendingAmount} INR) is pending. Kindly pay as soon as possible.\nThank you.`;

        // Message Send Karne Ka Function Call
        // await sendMessage(student.phone, message);

        console.log(`Reminder sent to ${student.name} (${student.phone})`);
      }
    }

    console.log("Monthly fee reminders sent successfully.");
  } catch (error) {
    console.error("Error sending fee reminders:", error);
  }
});
