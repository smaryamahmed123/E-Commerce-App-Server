import express from 'express';
import { ContactUs } from '../controllers/ContactController.js'; // Adjust path as needed
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/contact', authMiddleware, ContactUs);

export default router;
