import express from 'express';
import Product from '../model/product.js';
const productRouter = express.Router();

// Route to add a new product
productRouter.post('/add-product', async (req, res) => {
  try {
    const { name, category, price, image, description, stock, ratings } =
      req.body;

    // Create a new product
    const product = new Product({
      name,
      category,
      price,
      image,
      description,
      stock,
    });

    await product.save();

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      product,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});

export default productRouter;
