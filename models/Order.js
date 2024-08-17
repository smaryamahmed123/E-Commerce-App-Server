import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  billingAddress: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  items: [
    {
      id: Number,
      title: String,
      quantity: Number,
      price: Number,
      quantity: { type: Number, default: 1 }
    }
  ],
  total: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  userId: { // Reference to user ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
