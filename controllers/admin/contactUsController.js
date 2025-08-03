const sendEmailToAdmin = require("../../utils/emailToAdmin");
require("dotenv").config();

const contactUs = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    const textToAdmin = `Hello Admin,

You have received a new contact form submission. Here are the details:

Name: ${name}
Email: ${email}
Phone Number: ${phone}
Message:
"${message}"
Please take the necessary action.

Best regards,
'SPS Barsoi'`;

    const textToUser = `Hello ${name},

Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.

Here are the details of your submission:

Your Email: ${email},
Your Phone Number: ${phone},
Your Message:
"${message}"
Our team will review your message and respond shortly. If your query is urgent, feel free to contact us directly at [School Contact Email/Phone].

Best regards,
[Your School Name]
[School Website]`;

    await sendEmailToAdmin(
      email,
      "Thankyou for contacting SPS Barsoi",
      textToUser,
      res
    );
    await sendEmailToAdmin(
      process.env.ADMIN_EMAIL,
      "New Contact Form Submission from ${name}",
      textToAdmin,
      res
    );

    res.status(200).json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports = { contactUs };
