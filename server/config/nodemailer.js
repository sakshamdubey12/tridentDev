const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saksham12dubey@gmail.com",
    pass: "kemejyqlgebznvjl",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;