import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishListRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { testEmail } from './utils/testEmail.js';
import adminMiddleware from './middleware/adminMiddleware.js';
import session from 'express-session';
import passport from 'passport';
import './utils/passport.js';
import Order from './models/Order.js';
dotenv.config();

const app = express();
connectDB();


// Middleware
app.use(cors({
  origin: 'https://chipper-alpaca-e56ea9.netlify.app', // Make sure this matches exactly
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', contactRoutes);
app.get("/testEmail", testEmail)
// app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminMiddleware, adminRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
