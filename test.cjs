/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');
require('dotenv').config();

// Buat transporter dengan detail email bisnis Anda
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Ganti dengan SMTP host dari penyedia layanan Anda
  port: 587, // Port standar untuk SMTP (587 atau 465)
  secure: false, // true untuk port 465, false untuk port 587
  auth: {
    user: process.env.SMTP_EMAIL, // Alamat email bisnis Anda
    pass: process.env.SMTP_PASSWORD, // Password email bisnis Anda
  },
});

// Fungsi untuk mengirimkan email OTP
async function sendOTP(email, otpCode) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_USER}" <${process.env.SMTP_EMAIL}>`, // Nama dan email pengirim
      to: email, // Email tujuan
      subject: 'Your OTP Code', // Subjek email
      text: `Your OTP code is ${otpCode}`, // Isi pesan dalam teks
      html: `<b>Your OTP code is ${otpCode}</b>`, // Isi pesan dalam format HTML
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

// Contoh penggunaan
const emailPenerima = process.env.TEST_EMAIL;
const kodeOTP = Math.floor(100000 + Math.random() * 900000)
  .toString(); // Menghasilkan kode OTP 6 digit

sendOTP(emailPenerima, kodeOTP);
