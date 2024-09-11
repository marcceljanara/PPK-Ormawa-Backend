/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import Sellers from '../models/seller-models.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token tidak ditemukan' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.sellerId = decoded.sellerId;

    // Ambil penjual dari basis data
    const seller = await Sellers.findByPk(req.sellerId);
    if (!seller) return res.status(404).json({ msg: 'Penjual tidak ditemukan' });

    // Jika ada role atau atribut tambahan yang ingin digunakan, bisa ditambahkan di sini

    return next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: 'Token tidak valid' });
  }
};

export default verifyToken;
