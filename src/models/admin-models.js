/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import db from '../configs/database.js';

const Admin = db.define('Admin', {
  admin_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => `admin-${nanoid(10)}`,
    unique: true,
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin', // Role admin yang default
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default Admin;
