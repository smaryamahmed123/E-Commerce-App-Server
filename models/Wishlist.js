import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Add more fields as necessary
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
