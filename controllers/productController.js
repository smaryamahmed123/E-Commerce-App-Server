import axios from 'axios';

// Fetch all products from the external API
export const getProducts = async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch a single product by ID from the external API
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
