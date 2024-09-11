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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userId; // Misalnya ID pengguna bisa berupa sellerId atau adminId

    // Ambil ID produk dari parameter URL
    const productId = req.params.id;
    if (!productId) return res.status(400).json({ msg: 'ID produk diperlukan' });

    // Ambil data produk dari basis data
    const product = await Product.findByPk(productId);

    // Jika produk tidak ditemukan, kembalikan status 404
    if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    // Periksa apakah pengguna adalah seller atau admin
    const seller = await Seller.findByPk(req.userId);
    const admin = await Admin.findByPk(req.userId);

    // Jika seller tidak ditemukan tetapi admin ditemukan, beri akses
    if (seller) {
      if (product.seller_id !== req.userId) {
        return res.status(403).json({ msg: 'Anda tidak memiliki izin untuk mengakses produk ini' });
      }
    } else if (admin) {
      // Admin memiliki akses ke semua produk
      return next();
    } else {
      // Jika tidak ada seller atau admin yang ditemukan, kembalikan status 404
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }

    // Jika validasi berhasil, lanjutkan ke middleware berikutnya
    return next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ msg: 'Token tidak valid' });
  }
};

export default authorizeProductAccess;
