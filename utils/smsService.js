const axios = require("axios");
require("dotenv").config();

const sendSMS = async (phone, otp) => {
  try {
    // console.log(phone, otp);
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variable_values: otp,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response);
    if (!response) {
      console.log("response not found");
      return;
    }
    return {
      message: response.data,
      success: true,
    };
  } catch (err) {
    // console.log(err);
    return {
      message: "Internal Server Error",
      success: false,
    };
  }
};

module.exports = sendSMS;
