import express from 'express';
const router = express.Router();
import { getProducts, getProductById } from '../controllers/productController.js';

// Route to get all products
// router.get('/products', getProducts);

// // Route to get a single product by ID
// router.get('/products/:id', getProductById);

router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

export default router;
