/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin-models.js';
import Seller from '../models/seller-models.js';
import Product from '../models/product-models.js';

// Register a new admin
export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      msg: 'Admin successfully registered',
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to register admin' });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' },
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to login' });
  }
};

// Get list of sellers
export const getSellers = async (req, res) => {
  try {
    // Retrieve sellers with pagination
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;

    const sellers = await Seller.findAll({
      attributes: ['id', 'name', 'email', 'status'],
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    const totalCount = await Seller.count();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      sellers,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to retrieve sellers' });
  }
};

// Get details of a specific seller
export const getSellerById = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByPk(id);

    if (!seller) {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    return res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to retrieve seller' });
  }
};

// Activate a banned seller
export const activateSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByPk(id);

    if (!seller) {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    if (seller.status === 'active') {
      return res.status(400).json({ msg: 'Seller is already active' });
    }

    await Seller.update({ status: 'active' }, { where: { id } });

    return res.status(200).json({ msg: 'Seller has been activated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to activate seller' });
  }
};

// Ban a seller
export const banSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByPk(id);

    if (!seller) {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    if (seller.status === 'banned') {
      return res.status(400).json({ msg: 'Seller is already banned' });
    }

    await Seller.update({ status: 'banned' }, { where: { id } });

    return res.status(200).json({ msg: 'Seller has been banned' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to ban seller' });
  }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    await Admin.destroy({ where: { id } });

    return res.status(200).json({ msg: 'Admin has been deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to delete admin' });
  }
};

// Update an admin's details
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    await Admin.update(updatedFields, { where: { id } });

    return res.status(200).json({ msg: 'Admin details updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Failed to update admin' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // Ambil ID produk dari parameter URL
    const { id } = req.params;

    // Periksa apakah ID produk disediakan
    if (!id) return res.status(400).json({ msg: 'ID produk diperlukan' });

    // Cari produk di basis data
    const product = await Product.findByPk(id);

    // Jika produk tidak ditemukan, kembalikan status 404
    if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    // Hapus produk dari basis data
    await Product.destroy({ where: { id } });

    // Kirim respon berhasil
    return res.status(200).json({ msg: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Gagal menghapus produk' });
  }
};

export const getProduct = async (req, res) => {
  try {
    // Ambil ID produk dari parameter URL
    const { id } = req.params;

    // Cek apakah ID produk disediakan
    if (!id) return res.status(400).json({ msg: 'ID produk diperlukan' });

    // Cari produk di basis data
    const product = await Product.findByPk(id);

    // Jika produk tidak ditemukan, kembalikan status 404
    if (!product) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    // Kirim respon dengan data produk
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Gagal mengambil data produk' });
  }
};
