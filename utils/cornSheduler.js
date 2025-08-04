const cron = require("node-cron");
const generateMonthlyPayments = require("./generateMonthlyPayments");

// Every 1st day of month at 12:00 AM
cron.schedule("0 0 1 * *", async () => {
  console.log("📅 Running monthly payment generator...");
  await generateMonthlyPayments();
});
