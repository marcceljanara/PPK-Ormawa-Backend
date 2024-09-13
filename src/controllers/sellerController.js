/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Seller from '../models/seller-models.js';

// Mendapatkan data pengguna
export const getUsers = async (req, res) => {
  try {
    // Kembalikan data pengguna yang sedang login
    const seller = await Seller.findOne({
      where: { seller_id: req.sellerId },
      attributes: ['seller_id', 'name', 'email'],
    });

    if (!seller) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    return res.json(seller);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

// Registrasi pengguna baru
export const register = async (req, res) => {
  const {
    name, email, password, confPassword, phoneNumber,
  } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({
      msg: 'Password dan Konfirmasi Password Tidak Cocok',
    });
  }

  try {
    // Cek apakah email sudah ada dalam basis data
    const existingSeller = await Seller.findOne({ where: { email } });
    if (existingSeller) {
      return res.status(400).json({
        msg: 'Email sudah terdaftar. Silakan gunakan email lain.',
      });
    }

    // Cek apakah nomor telepon sudah ada dalam basis data
    const existingPhoneNumber = await Seller.findOne({ where: { phone_number: phoneNumber } });
    if (existingPhoneNumber) {
      return res.status(400).json({
        msg: 'Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    await Seller.create({
      name,
      email,
      password: hashPassword,
      phone_number: phoneNumber,
    });

    return res.json({
      msg: 'Registrasi Berhasil',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

// Login pengguna
export const login = async (req, res) => {
  try {
    const seller = await Seller.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!seller) {
      return res.status(404).json({
        msg: 'Email tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(req.body.password, seller.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password salah',
      });
    }

    const sellerId = seller.seller_id;
    const { name, email } = seller;
    const accessToken = jwt.sign({
      sellerId, name, email,
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '2m',
    });
    const refreshToken = jwt.sign({
      sellerId, name, email,
    }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    await Seller.update({ refresh_token: refreshToken }, {
      where: {
        seller_id: sellerId,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

// Logout pengguna
export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(400).json({ msg: 'Refresh token tidak ada' });

  try {
    const seller = await Seller.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!seller) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    const sellerId = seller.seller_id;
    await Seller.update({ refresh_token: null }, {
      where: {
        seller_id: sellerId,
      },
    });

    res.clearCookie('refreshToken');
    return res.status(200).json({
      msg: 'Telah logout',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

// Mengubah password pengguna
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confNewPassword } = req.body;

  if (newPassword !== confNewPassword) {
    return res.status(400).json({
      msg: 'Password baru dan Konfirmasi Password Tidak Cocok',
    });
  }

  try {
    const seller = await Seller.findOne({
      where: {
        seller_id: req.sellerId,
      },
    });

    if (!seller) {
      return res.status(404).json({
        msg: 'Pengguna tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(oldPassword, seller.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password lama salah',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashNewPassword = await bcryptjs.hash(newPassword, salt);

    await Seller.update({ password: hashNewPassword }, {
      where: {
        seller_id: req.sellerId,
      },
    });

    return res.json({
      msg: 'Password berhasil diubah',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(401);

    // Mencari seller berdasarkan refresh token
    const seller = await Seller.findOne({
      where: {
        refresh_token: refreshToken, // Kolom refresh_token di tabel Seller
      },
    });

    if (!seller) return res.sendStatus(403);

    // Verifikasi refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);

      // Ambil data dari seller untuk membuat access token baru
      const sellerId = seller.seller_id;
      const { name, email } = seller;

      const accessToken = jwt.sign({
        sellerId, name, email,
      }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '40s',
      });

      return res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};
