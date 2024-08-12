import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product must have a category'],
    },
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
      min: [0, 'Price must be a positive number'],
    },
    image: {
      type: String,
      required: [true, 'Product must have an image'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 100,
      min: [0, 'Stock cannot be negative'],
    },
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'Rating must be associated with a user'],
          default: '6596d6d3fcb1d2f350ad7a0f',
        },
        rating: {
          type: Number,
          min: [1, 'Rating must be between 1 and 5'],
          max: [5, 'Rating must be between 1 and 5'],
          required: [true, 'Rating is required'],
          default: 5,
        },
        comment: {
          type: String,
          trim: true,
          default: 'This is a very good product',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
