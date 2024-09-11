/* eslint-disable arrow-parens */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
import { Op } from 'sequelize';
import { parse } from 'json2csv';
import Sensor from '../models/sensor-models.js';

const getDataWithinTimeframe = async (req, res) => {
  const { timeframe } = req.params;
  let timeCondition;

  // Menggunakan switch case untuk menentukan waktu
  switch (timeframe) {
    case '1d':
      timeCondition = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      timeCondition = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      timeCondition = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  try {
    const data = await Sensor.findAll({
      attributes: ['timestamp', 'temperature', 'humidity', 'lux', 'co2', 'soil_moisture'],
      where: {
        timestamp: {
          [Op.gte]: timeCondition,
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getDataByMonth = async (req, res) => {
  const { month } = req.params;
  const year = new Date().getFullYear();

  // Validasi bulan
  if (month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month' });
  }

  try {
    const data = await Sensor.findAll({
      attributes: ['timestamp', 'temperature', 'humidity', 'lux', 'co2', 'soil_moisture'],
      where: {
        timestamp: {
          [Op.between]: [
            new Date(year, month - 1, 1),
            new Date(year, month, 1),
          ],
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const downloadDataAsCSV = async (req, res) => {
  const { timeframe } = req.params;
  let timeCondition;

  // Menggunakan switch case untuk menentukan waktu
  switch (timeframe) {
    case '1d':
      timeCondition = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      timeCondition = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      timeCondition = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return res.status(400).json({ error: 'Invalid timeframe' });
  }

  try {
    const data = await Sensor.findAll({
      attributes: ['timestamp', 'temperature', 'humidity', 'lux', 'co2', 'soil_moisture'],
      where: {
        timestamp: {
          [Op.gte]: timeCondition,
        },
      },
    });

    // Convert data to CSV
    const csv = parse(data.map(item => item.toJSON()));

    // Set response headers
    res.setHeader('Content-disposition', `attachment; filename=sensor-data-${timeframe}.csv`);
    res.set('Content-Type', 'text/csv');
    // Send CSV data
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getLatestData = async (req, res) => {
  try {
    const data = await Sensor.findAll({
      attributes: ['timestamp', 'temperature', 'humidity', 'lux', 'co2', 'soil_moisture'],
      order: [['timestamp', 'DESC']],
      limit: 100,
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export {
  getDataWithinTimeframe, getDataByMonth, downloadDataAsCSV, getLatestData,
};
