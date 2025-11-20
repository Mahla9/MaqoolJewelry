import Product from '../models/Product.js';

// گرفتن لیست همه محصولات
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت محصولات", error: error.message });
  }
};