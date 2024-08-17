import express from 'express';
import { placeOrder, checkout, getOrders, getOrdersById } from '../controllers/orderController.js'; // Adjust path as needed
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/orders', authMiddleware, placeOrder);
router.post('/checkout', authMiddleware, checkout);
router.get('/orders/all', getOrders);
router.get('/orders', authMiddleware, getOrdersById);


export default router;
