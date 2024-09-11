/* eslint-disable import/extensions */
/* eslint-disable radix */
import { Op } from 'sequelize';
import Product from '../models/product-models.js';

export const createProduct = async (req, res) => {
  const {
    name, category, brand, description, price, quantity,
  } = req.body;

  // Array untuk validasi data wajib
  const requiredFields = [name, category, price, quantity];

  // Validasi data wajib
  for (const field of requiredFields) {
    if (!field) {
      return res.status(400).json({
        msg: 'Gagal menambahkan produk. Mohon mengisi data wajib',
      });
    }
  }

  try {
    // Membuat data produk baru
    await Product.create({
      name,
      category,
      brand,
      description,
      price,
      quantity,
      user_id: req.userId,
    });

    // Mengirim respon berhasil
    return res.status(201).json({
      msg: 'Data produk berhasil ditambahkan',
    });
  } catch (error) {
    // Mengirim respon error
    return res.status(500).json({
      msg: 'Data produk gagal ditambahkan',
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Mengambil parameter limit, offset, dan search dari query string
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    // Menyiapkan klausa where untuk pencarian
    let whereClause = {};
    if (searchQuery) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { category: { [Op.iLike]: `%${searchQuery}%` } },
          { brand: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      };
    }

    // Mengambil data produk dengan memperhitungkan limit, offset, dan pencarian
    const products = await Product.findAll({
      attributes: ['product_id', 'name', 'category', 'brand', 'price'],
      limit,
      offset,
      where: whereClause,
      order: [['product_id', 'ASC']],
    });

    // Menghitung total data
    const totalCount = await Product.count({
      where: whereClause,
    });

    // Menghitung total halaman
    const totalPages = Math.ceil(totalCount / limit);

    // Mengirim respon dengan data produk dan informasi halaman
    return res.status(200).json({
      products,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data produk',
    });
  }
};

export const getProductsUser = async (req, res) => {
  try {
    // Mengambil parameter limit, offset, dan search dari query string
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    // Menyiapkan filter berdasarkan role dan pencarian
    let whereClause = {};
    if (req.userRole !== 'admin') {
      whereClause.user_id = req.userId; // Filter data berdasarkan user_id jika bukan admin
    }

    if (searchQuery) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { category: { [Op.iLike]: `%${searchQuery}%` } },
          { brand: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      };
    }

    // Mengambil data produk dengan memperhitungkan limit, offset, dan pencarian
    const products = await Product.findAll({
      attributes: ['product_id', 'name', 'category', 'brand', 'price'],
      limit,
      offset,
      where: whereClause,
      order: [['product_id', 'ASC']],
    });

    // Menghitung total data
    const totalCount = await Product.count({
      where: whereClause,
    });

    // Menghitung total halaman
    const totalPages = Math.ceil(totalCount / limit);

    // Mengirim respon dengan data produk dan informasi halaman
    return res.status(200).json({
      products,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data produk',
    });
  }
};

export const getDetailProductById = async (req, res) => {
  try {
    // Mengambil parameter ID dari URL
    const { id } = req.params;

    // Mengambil detail produk berdasarkan ID
    const product = await Product.findByPk(id);

    // Jika data produk tidak ditemukan, kembalikan status 404
    if (!product) {
      return res.status(404).json({
        msg: 'Data produk tidak ditemukan',
      });
    }

    // Mengirim respon dengan data produk
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal mengambil data produk',
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params; // Mendapatkan id dari parameter URL
  const {
    name, category, brand, description, price, quantity,
  } = req.body;

  try {
    // Mengambil data produk berdasarkan id
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        msg: 'Produk tidak ditemukan',
      });
    }

    // Memeriksa apakah pengguna memiliki izin untuk memperbarui produk (jika bukan admin)
    if (req.userRole !== 'admin' && product.user_id !== req.userId) {
      return res.status(403).json({
        msg: 'Anda tidak memiliki izin untuk memperbarui produk ini',
      });
    }

    // Memperbarui data produk
    await Product.update({
      name,
      category,
      brand,
      description,
      price,
      quantity,
    }, {
      where: {
        product_id: id,
      },
    });

    // Mengirim respon berhasil
    return res.status(200).json({
      msg: 'Data produk berhasil diperbarui',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Data produk gagal diperbarui',
    });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    // Mengambil parameter ID dari URL
    const { id } = req.params;

    // Mengambil data produk berdasarkan ID
    const product = await Product.findByPk(id);

    // Jika data produk tidak ditemukan, kembalikan status 404
    if (!product) {
      return res.status(404).json({
        msg: 'Data produk tidak ditemukan',
      });
    }

    // Menghapus data produk berdasarkan ID
    await Product.destroy({
      where: {
        product_id: id,
      },
    });

    // Mengirim respon berhasil
    return res.status(200).json({
      msg: 'Data produk berhasil dihapus',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Gagal menghapus data produk',
    });
  }
};
