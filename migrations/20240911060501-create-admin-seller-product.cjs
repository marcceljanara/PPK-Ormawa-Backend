/* eslint-disable no-unused-vars */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { nanoid } = await import('nanoid');
    // Create Admin Table
    await queryInterface.createTable('Admin', {
      admin_id: {
        type: Sequelize.STRING,
        defaultValue: () => `admin-${nanoid(10)}`,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'admin', // Role admin yang default
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create Seller Table
    await queryInterface.createTable('Seller', {
      seller_id: {
        type: Sequelize.STRING,
        defaultValue: () => `seller-${nanoid(10)}`,
        primaryKey: true,
        allowNull: false,
      },
      admin_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Admin',
          key: 'admin_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // True for active, false for inactive
      },
      refresh_token: { // Add refresh_token field here
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Create Product Table
    await queryInterface.createTable('Product', {
      product_id: {
        type: Sequelize.STRING,
        defaultValue: () => `product-${nanoid(10)}`,
        primaryKey: true,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Seller',
          key: 'seller_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      admin_id: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Admin',
          key: 'admin_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Optional admin who deleted the product
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      category: { // Kolom kategori
        type: Sequelize.STRING,
        allowNull: true, // Jika kategori tidak selalu diperlukan
      },
      image_url: { // Kolom URL gambar
        type: Sequelize.STRING,
        allowNull: true, // Jika gambar tidak selalu diperlukan
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true, // When the product is deleted, this field will be populated
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Product');
    await queryInterface.dropTable('Seller');
    await queryInterface.dropTable('Admin');
  },
};
