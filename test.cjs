/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

// Buat transporter dengan detail email bisnis Anda
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Ganti dengan SMTP host dari penyedia layanan Anda
  port: 587, // Port standar untuk SMTP (587 atau 465)
  secure: false, // true untuk port 465, false untuk port 587
  auth: {
    user: 'no-reply@xsmartagrichain.com', // Alamat email bisnis Anda
    pass: 'Kucingbelang@123', // Password email bisnis Anda
  },
});

// Fungsi untuk mengirimkan email OTP
async function sendOTP(email, otpCode) {
  try {
    const info = await transporter.sendMail({
      from: '"no-reply" <no-reply@xsmartagrichain.com>', // Nama dan email pengirim
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
const emailPenerima = 'nengahjonara@gmail.com';
const kodeOTP = Math.floor(100000 + Math.random() * 900000)
  .toString(); // Menghasilkan kode OTP 6 digit

sendOTP(emailPenerima, kodeOTP);
