import Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, product, quantity = 1 } = req.body;
    // console.log("Received request body:", req.body); // Debugging line
    console.log("Received request body:", JSON.stringify(req.body, null, 2)); // Detailed logging
    
    // Additional debugging logs
    console.log("userId:", userId);
    // console.log("product:", product);
    console.log("product:", JSON.stringify(product, null, 2));
    console.log("quantity:", quantity);
    console.log("productId:", product.id);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
    if (!product || !product.id) {
      return res.status(400).json({ error: 'Product ID is missing' });
    }
    if (quantity == null) {
      return res.status(400).json({ error: 'Quantity is missing' });
    }

    let cartItem = await Cart.findOne({ userId, 'product.id': product.id });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new Cart({ userId, product, quantity });
    }

    await cartItem.save();
    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};





export const getFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartItem = await Cart.findOne({ userId, 'product.id': productId });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const removeFromCart = async (req, res) => {
//   try {
//     const { userId, productId } = req.body; // Adjust as per how you are sending userId
//     await Cart.deleteOne({ userId, 'product.id': productId });
//     res.status(200).json({ message: 'Product removed from cart successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID missing' });
    }

    const result = await Cart.deleteOne({ 'product.id': productId });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: error.message });
  }
};




