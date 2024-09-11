/* eslint-disable import/extensions */
import express from 'express';
import {
  getDataByMonth, getDataWithinTimeframe, downloadDataAsCSV,
  getLatestData,
} from '../controllers/mqttData.js';
import verifyToken from '../middleware/verify-token.js';
import authorizeProductAccess from '../middleware/auth-product.js';
import { createProduct, deleteProductById, getDetailProductById, getProducts, getProductsUser, updateProduct } from '../controllers/productController.js';

const router = express.Router();

// Record of data sensor
router.get('/data/:timeframe', getDataWithinTimeframe);
router.get('/data/month/:month', getDataByMonth);
router.get('/data/download/:timeframe', downloadDataAsCSV);
router.get('/data/latest', getLatestData);

// Users
// Register, Login, & change password Logout route
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.put('/password', verifyToken, changePassword);

// CRUD medicines route
router.post('/products', verifyToken, createProduct);
router.get('/productsSeller', verifyToken, getProductsUser);
router.put('/products/:id', verifyToken, authorizeProductAccess, updateProduct);
router.delete('/products/:id', verifyToken, authorizeProductAccess, deleteProductById);

// CRUD Multi User
router.get('/products', getProducts);
router.get('/products/:id', getDetailProductById);


export default router;
