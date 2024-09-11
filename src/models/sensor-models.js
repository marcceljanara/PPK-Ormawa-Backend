/* eslint-disable import/extensions */
import { DataTypes } from 'sequelize';
import db from '../configs/database.js';

const Sensor = db.define('Sensor', {
  sensor_id: {
    type: DataTypes.INTEGER, // Menggunakan INTEGER untuk auto-increment
    primaryKey: true,
    autoIncrement: true, // Menandakan bahwa kolom ini auto-increment
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lux: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  co2: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  soil_moisture: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: true, // Untuk createdAt dan updatedAt
});

export default Sensor;
