/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import db from '../configs/database.js';

const Seller = db.define('Seller', {
  seller_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => `seller-${nanoid(10)}`,
    unique: true,
  },
  admin_id: {
    type: DataTypes.STRING,
    allowNull: true,
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Active by default
  },
  refresh_token: { // Add the refresh token field here
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default Seller;
