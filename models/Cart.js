import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  product: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
  },
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
