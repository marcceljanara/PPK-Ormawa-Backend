/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import Product from '../models/product-models.js';
import Seller from '../models/seller-models.js';
import Admin from '../models/admin-models.js';

const authorizeProductAccess = async (req, res, next) => {
  try {
    // Ambil token dari header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token tidak ditemukan' });

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.sellerId = decoded.sellerId || null; // Dapatkan sellerId dari token
    req.adminId = decoded.adminId || null; // Dapatkan adminId dari token

    // Ambil ID produk dari parameter URL
    const productId = req.params.id;
    if (!productId) return res.status(400).json({ msg: 'ID produk diperlukan' });

    // Ambil data produk dari basis data
    const product = await Product.findByPk(productId);

    // Jika produk tidak ditemukan, kembalikan status 404
    if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    // Jika pengguna adalah seller, periksa apakah mereka pemilik produk
    if (req.sellerId) {
      const seller = await Seller.findByPk(req.sellerId);
      if (!seller || product.seller_id !== req.sellerId) {
        return res.status(403).json({ msg: 'Anda tidak memiliki izin untuk mengakses produk ini' });
      }
    } else if (req.adminId) { // perbaikan posisi brace
      const admin = await Admin.findByPk(req.adminId);
      if (!admin) {
        return res.status(403).json({ msg: 'Anda tidak memiliki izin untuk mengakses produk ini' });
      }
    } else { // perbaikan posisi brace
      return res.status(403).json({ msg: 'Anda tidak memiliki izin untuk mengakses produk ini' });
    }

    // Jika validasi berhasil, lanjutkan ke middleware berikutnya
    return next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: 'Token tidak valid atau terjadi kesalahan saat memverifikasi' });
  }
};

export default authorizeProductAccess;
