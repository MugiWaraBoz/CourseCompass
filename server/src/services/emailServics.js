require('dotenv').config({
  path: '../../.env',
  quiet: true,
});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
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

async function sendEmail({ to, subject, link, actionText }) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
      color: #18181b;
    ">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 40px 20px;">

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                max-width: 520px;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
              "
            >
              <tr>
                <td style="padding: 32px;">

                  <h1 style="
                    margin: 0 0 16px;
                    font-size: 24px;
                    font-weight: 600;
                  ">
                    ${subject}
                  </h1>

                  <p style="
                    margin: 0 0 24px;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #52525b;
                  ">
                    Click the button below to continue.
                    This link will expire in <strong>15 minutes</strong>.
                  </p>

                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="
                        border-radius: 6px;
                        background-color: #18181b;
                      ">
                        <a
                          href="${link}"
                          style="
                            display: inline-block;
                            padding: 12px 24px;
                            font-size: 15px;
                            font-weight: 600;
                            color: #ffffff;
                            text-decoration: none;
                          "
                        >
                          ${actionText}
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="
                    margin: 28px 0 8px;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #71717a;
                  ">
                    If the button doesn't work, copy and paste this link
                    into your browser:
                  </p>

                  <p style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.5;
                    word-break: break-all;
                  ">
                    <a
                      href="${link}"
                      style="color: #2563eb;"
                    >
                      ${link}
                    </a>
                  </p>

                  <hr style="
                    margin: 28px 0;
                    border: 0;
                    border-top: 1px solid #e4e4e7;
                  ">

                  <p style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.5;
                    color: #a1a1aa;
                  ">
                    If you didn't request this, you can safely ignore this email.
                  </p>

                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

  try {
    // console.log(`Sending email to: ${to}, subject: ${subject}`);
    return await transporter.sendMail({
      from: `"CourseCompass" <${process.env.GMAIL_SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmail,
};
