// import express from 'express';
// const router = express.Router();
// import {addToCart ,getFromCart} from '../controllers/cartController.js'
// // Add product to cart
// router.post('/add', addToCart);

// // Get cart items
// router.get('/fetch/:userId', getFromCart);

// export default router;






import express from 'express';
import { addToCart, getFromCart, updateCartItemQuantity, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/fetch/:userId', getFromCart);
router.patch('/updateQuantity', updateCartItemQuantity);
router.delete('/remove/:productId', removeFromCart);

export default router;
