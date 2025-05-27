const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (email, resetCode) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <h2>Password Reset Request</h2>
        <p>Your verification code is: <strong>${resetCode}</strong></p>
      `
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendVerificationEmail };