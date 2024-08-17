import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Wishlist from '../models/Wishlist.js'; // Assuming you have a Wishlist model

const router = express.Router();

// Fetch wishlist items
router.get('/wishlist', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id });
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).send('Server Error');
  }
});

// Delete a wishlist item
router.delete('/wishlist/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.findOneAndDelete({ _id: id, userId: req.user.id });
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
