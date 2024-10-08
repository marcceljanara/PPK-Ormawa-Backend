/* eslint-disable import/extensions */
import express from 'express';
import {
  getDataByMonth, getDataWithinTimeframe, downloadDataAsCSV,
  getLatestData,
} from '../controllers/mqttData.js';
import verifyToken from '../middleware/verify-token.js';
import authorizeProductAccess from '../middleware/auth-product.js';
import {
  createProduct, deleteProductById, getDetailProductById,
  getProducts, getProductsUser, updateProduct,
} from '../controllers/productController.js';
import {
  changePassword, getUsers, login, logout, refreshToken, register,
  verifyOtp,
} from '../controllers/sellerController.js';
import verifySellerMiddleware from '../middleware/isVerified.js';

const router = express.Router();

// Record of data sensor
router.get('/data/timeframe/:timeframe', getDataWithinTimeframe);
router.get('/data/month/:month', getDataByMonth);
router.get('/data/download/:timeframe', downloadDataAsCSV);
router.get('/data/latest', getLatestData);

// SELLER
router.get('/users', verifyToken, verifySellerMiddleware, getUsers);
router.post('/users', register);
router.post('/login', login);
router.post('/verify', verifyOtp);
router.get('/token', refreshToken);
router.delete('/logout', logout);
router.put('/password', verifyToken, verifySellerMiddleware, changePassword);

// CRUD PRODUCT
router.post('/products', verifyToken, verifySellerMiddleware, createProduct);
router.get('/productsseller', verifyToken, verifySellerMiddleware, getProductsUser);
router.put('/products/:id', verifyToken, authorizeProductAccess, verifySellerMiddleware, updateProduct);
router.delete('/products/:id', verifyToken, authorizeProductAccess, verifySellerMiddleware, deleteProductById);

// CRUD GUEST
router.get('/products', getProducts);
router.get('/products/:id', getDetailProductById);

export default router;
