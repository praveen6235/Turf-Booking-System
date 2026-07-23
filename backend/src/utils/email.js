const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter (Using Mailtrap or Gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME || 'dummy_user',
      pass: process.env.EMAIL_PASSWORD || 'dummy_pass'
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Turf Booking System <noreply@turfbooking.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: options.html (Can add HTML templates later)
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
