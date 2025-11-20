import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    silverAtCreation: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true, // تصویر اصلی محصول
    },
    gallery: {
      type: [String], // آرایه‌ای از تصاویر
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    ringSize: {
      type: String,
      required: false,
    },
    metalType: {
      type: String,
      required: false,
    },
    jewelleryType: {
      type: String,
      required: false,
    },
    jewellerySize: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // اضافه کردن createdAt و updatedAt
  }
);

export default mongoose.model('Product', productSchema);