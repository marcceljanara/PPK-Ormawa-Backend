/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import db from '../configs/database.js';

const Product = db.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => `product-${nanoid(10)}`,
    unique: true,
  },
  seller_id: {
    type: DataTypes.STRING,
    references: {
      model: 'Seller',
      key: 'seller_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  admin_id: {
    type: DataTypes.STRING,
    references: {
      model: 'Admin',
      key: 'admin_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default Product;
