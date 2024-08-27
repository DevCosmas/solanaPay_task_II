import Product from '../model/product.js';
import AppError from '../utils/appError.js';

export async function fetchProduct(req, res, next) {
  try {
    const {
      category,
      name,
      priceMin,
      priceMax,
      page = 1,
      limit = 10,
    } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const query = {};

    if (category) {
      query.category = category;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
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

    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      totalResults: totalProducts,
      data: products,
    });
  } catch (err) {
    console.error(err);
    next(new AppError('Error fetching products', 500));
  }
}

export async function findOneProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { category, name, priceMin, priceMax } = req.query;
    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

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

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    console.error(err);
    next(new AppError('Error fetching product', 500));
  }
}
