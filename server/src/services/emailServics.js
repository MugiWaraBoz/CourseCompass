require('dotenv').config({ path: '../../.env' });
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SMTP_USER,
    pass: process.env.GMAIL_SMTP_PASS,
  },
});

// Verify the SMTP connection
// transporter.verify((error) => {
//   if (error) {
//     console.error("SMTP connection failed:", error);
//   } else {
//     console.log("SMTP connection successful");
//   }
// });

async function sendEmail({ to, subject, html }) {
    try{
        // console.log(`Sending email to: ${to}, subject: ${subject}`);
        return await transporter.sendMail({
            from: `"CourseCompass" <${process.env.GMAIL_SMTP_USER}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = {
  sendEmail,
};