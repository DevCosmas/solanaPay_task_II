import Product from '../model/product.js';
import AppError from '../utils/appError.js';

export async function fetchProduct(req, res, next) {
  try {
    // Extract query parameters
    const {
      category,
      name,
      priceMin,
      priceMax,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build query object
    const query = {};

    if (category) {
      query.category = category;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) {
        query.price.$gte = parseFloat(priceMin);
      }
      if (priceMax) {
        query.price.$lte = parseFloat(priceMax);
      }
    }

    // Pagination logic
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch products from the database
    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Count total number of products matching the query for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    // Send response
    res.status(200).json({
      status: 'success',
      results: products.length,
      totalResults: totalProducts,
      data: products,
    });
  } catch (err) {
    console.error(err); // Use console.error for logging errors
    next(new AppError('Error fetching products', 500)); // Adjust error message
  }
}

export async function findOneProduct(req, res, next) {
  try {
    // Extract product ID from request params
    const { id } = req.params;

    // Extract optional filters from query parameters
    const { category, name, priceMin, priceMax } = req.query;

    // Find product by ID
    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    // Apply additional filters if provided
    let isMatch = true;

    if (category && product.category !== category) {
      isMatch = false;
    }

    if (name && !product.name.toLowerCase().includes(name.toLowerCase())) {
      isMatch = false;
    }

    if (
      (priceMin && product.price < parseFloat(priceMin)) ||
      (priceMax && product.price > parseFloat(priceMax))
    ) {
      isMatch = false;
    }

    if (!isMatch) {
      return next(
        new AppError('Product does not match the provided filters', 404)
      );
    }

    // Send response with product details
    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    console.error(err); // Use console.error for logging errors
    next(new AppError('Error fetching product', 500)); // Adjust error message
  }
}
