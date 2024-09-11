/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Seller from '../models/seller-models.js';

// Mendapatkan data pengguna
export const getUsers = async (req, res) => {
  try {
    // Kembalikan data pengguna yang sedang login
    const user = await Seller.findOne({
      where: { user_id: req.userId },
      attributes: ['user_id', 'name', 'email'],
    });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
  }
};

// Registrasi pengguna baru
export const register = async (req, res) => {
  const {
    name, email, password, confPassword,
  } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({
      msg: 'Password dan Konfirmasi Password Tidak Cocok',
    });
  }

  try {
    // Cek apakah email sudah ada dalam basis data
    const existingUser = await Seller.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        msg: 'Email sudah terdaftar. Silakan gunakan email lain.',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);

    await Seller.create({
      name,
      email,
      password: hashPassword,
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
    const user = await Seller.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).json({
        msg: 'Email tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password salah',
      });
    }

    const userId = user.user_id;
    const { name } = user;
    const { email } = user;
    const accessToken = jwt.sign({
      userId, name, email,
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '2m',
    });
    const refreshToken = jwt.sign({
      userId, name, email,
    }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    await Seller.update({ refresh_token: refreshToken }, {
      where: {
        user_id: userId,
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
    const user = await Seller.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });

    const userId = user.user_id;
    await Seller.update({ refresh_token: null }, {
      where: {
        user_id: userId,
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
    const user = await Seller.findOne({
      where: {
        user_id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        msg: 'Pengguna tidak ditemukan',
      });
    }

    const match = await bcryptjs.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({
        msg: 'Password lama salah',
      });
    }

    const salt = await bcryptjs.genSalt();
    const hashNewPassword = await bcryptjs.hash(newPassword, salt);

    await Seller.update({ password: hashNewPassword }, {
      where: {
        user_id: req.userId,
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
