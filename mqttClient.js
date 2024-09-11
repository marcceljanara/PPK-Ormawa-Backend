/* eslint-disable no-cond-assign */
/* eslint-disable import/extensions */
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import SensorData from './src/models/sensor-models.js';
import db from './src/configs/database.js';

dotenv.config();

const mqttTopic = process.env.MQTT_TOPIC;

// Cek dan log env variables
const {
  MQTT_HOST,
  MQTT_USERNAME,
  MQTT_PASSWORD,
} = process.env;

if (!MQTT_HOST || !MQTT_USERNAME || !MQTT_PASSWORD || !mqttTopic) {
  console.error('MQTT configuration is missing');
  process.exit(1);
}

// Menghubungkan ke broker MQTT
const client = mqtt.connect(MQTT_HOST, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  port: 1883, // Port default untuk MQTT adalah 1883
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe(mqttTopic, (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to topic:', mqttTopic);
    }
  });
});

client.on('message', async (topic, message) => {
  if (topic === mqttTopic) {
    try {
      // Parse data
      const rawData = JSON.parse(message);
      const data = {
        timestamp: rawData.timestamp,
        temperature: parseFloat(rawData.temperature),
        humidity: parseFloat(rawData.humidity),
        lux: parseInt(rawData.lux, 10),
        soilMoisture: parseFloat(rawData.soilMoisture),
        ECO2: parseInt(rawData.ECO2, 10),
      };

      // Validasi data
      const isValidData = data.timestamp && !Number.isNaN(data.temperature)
        && !Number.isNaN(data.humidity)
        && !Number.isNaN(data.lux) && !Number.isNaN(data.soilMoisture)
        && !Number.isNaN(data.ECO2);

      if (!isValidData) {
        console.error('Invalid data format:', data);
        return;
      }

      // Pastikan koneksi ke database
      await db.authenticate();

      // Simpan data ke database
      await SensorData.create(data);
      console.log('Data saved to database:', data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
});
