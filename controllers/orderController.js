import Order from '../models/Order.js';
import sendOrderConfirmation from '../utils/sendEmail.js'; // Adjust path as necessary


export const placeOrder = async (req, res) => {
  try {
    console.log('User from request:', req.user);
    const { billingAddress, shippingAddress, paymentMethod, items } = req.body;

    if (!req.user?.email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const userEmail = req.user.email;
    const userId = req.user._id;

    console.log(userId); // Log userId for debugging
    const newOrder = new Order({
      billingAddress,
      shippingAddress,
      paymentMethod,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Calculate total
      orderDate: new Date(),
      userId,
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder);

    // const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id }
    });

    const emailHtml = `
      <h1>Order Confirmation</h1>
      <p>Order Number: ${newOrder._id}</p>
      <h2>Summary of Items Purchased</h2>
      ${items.map(item => `<p>${item.title} x ${item.quantity} - ${item.price} Rs.</p>`).join('')}
      <h2>Shipping Details</h2>
      <p>Address: ${shippingAddress}</p>
      <p>Estimated Delivery Date: ${new Date(new Date().setDate(new Date().getDate() + 7)).toDateString()}</p>
      <h2>Contact Information for Support</h2>
      <p>Phone: +1234567890</p>
      <p>Email: support@example.com</p>
    `;

     sendOrderConfirmation(userEmail, 'Order Confirmation', emailHtml);

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

  export const checkout = async (req, res) => {
    try {
      const { billingAddress, shippingAddress, paymentMethod, items } = req.body;
  
      // Ensure required fields are present
      if (!billingAddress || !shippingAddress || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ message: 'All fields are required and items should not be empty' });
      }
  
      const userId = req.user.id; // Extract userId from the request object
console.log('userid', userId)
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      // Validate items
      for (const item of items) {
        if (typeof item.price !== 'number' || isNaN(item.price) || item.price <= 0) {
          console.error('Invalid item price:', item.price);
          return res.status(400).json({ message: 'Invalid item price' });
        }
  
        // Ensure quantity is a valid number
        const quantity = parseInt(item.quantity, 10) || 1; // Default to 1 if not provided
        if (isNaN(quantity) || quantity <= 0) {
          console.error('Invalid item quantity:', item.quantity);
          return res.status(400).json({ message: 'Invalid item quantity' });
        }
      }
  
      // Calculate total
      const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity, 10) || 1; // Default to 1 if quantity is invalid
        return sum + (price * quantity);
      }, 0);
  
      if (isNaN(total)) {
        console.error('Total calculation failed');
        return res.status(500).json({ message: 'Total calculation failed' });
      }
  
      // Create and save the order
      const newOrder = new Order({
        userId,
        billingAddress,
        shippingAddress,
        paymentMethod,
        items,
        total,
        orderDate: new Date(),
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json({ order: savedOrder });
  
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  


  export const getOrders = async (req, res) => {
    try {
      // Fetch all orders
      const orders = await Order.find();
      
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send({ message: 'Server Error', error: error.message });
    }
  };


  // Modify getOrders function to filter by user ID
  export const getOrdersById = async (req, res) => {
    try {
      const userId = req.user.id; // Retrieve userId from the authenticated user
      console.log('User ID:', userId);
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Fetch orders where the userId matches the logged-in user
      const orders = await Order.find({ userId });
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  
