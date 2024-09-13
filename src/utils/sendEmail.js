import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Buat transporter dengan konfigurasi SMTP Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Host SMTP dari Hostinger
      port: 465, // Port SMTP yang aman (SSL)
      secure: true, // Gunakan SSL
      auth: {
        user: process.env.SMTP_EMAIL, // Alamat email bisnis Anda
        pass: process.env.SMTP_PASSWORD, // Password email bisnis Anda
      },
    });

    // Kirim email
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      text,
    });

    console.log('Email berhasil terkirim');
  } catch (error) {
    console.error('Gagal mengirim email', error);
  }
};

export default sendEmail;
