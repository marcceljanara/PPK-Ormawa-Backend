/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import Seller from '../models/seller-models.js'; // Import model Seller

const verifySellerMiddleware = async (req, res, next) => {
  try {
    // Ambil ID seller dari request (misalnya dari token yang terverifikasi sebelumnya)
    const { sellerId } = req;

    // Cek apakah seller ID ada
    if (!sellerId) {
      return res.status(401).json({ msg: 'Akses ditolak. Seller ID tidak ditemukan.' });
    }

    // Cari seller di database
    const seller = await Seller.findByPk(sellerId);

    // Jika seller tidak ditemukan
    if (!seller) {
      return res.status(404).json({ msg: 'Seller tidak ditemukan.' });
    }

    // Cek status verifikasi
    if (!seller.is_verified) {
      return res.status(403).json({ msg: 'Akses ditolak. Seller belum terverifikasi.' });
    }

    // Jika seller sudah terverifikasi, lanjutkan ke middleware berikutnya
    next();
  } catch (error) {
    console.error('Error verifying seller:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan pada server.' });
  }
};

export default verifySellerMiddleware;
