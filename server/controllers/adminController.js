import User from "../models/User.js";
import Product from '../models/Product.js';
import Orders from "../models/Orders.js";

// دریافت لیست همه کاربران
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users });
};

// حذف کاربر با آیدی
export const deleteUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

  await user.deleteOne();
  res.status(200).json({ message: "کاربر حذف شد" });
};


// ایجاد یک محصول جدید
export const addProduct = async (req, res) => {
  try {
    const { productId, title, price, description, category, stock, ringSize, metalType, jewelleryType, jewellerySize, weight } = req.body;
    // فایل اصلی
    const image = req.files && req.files['image'] && req.files['image'][0] ? req.files['image'][0].path : '';
    // گالری
    const gallery = req.files && req.files['gallery'] ? req.files['gallery'].map(f => f.path) : [];

    if (!image) {
      return res.status(400).json({ message: 'تصویر اصلی محصول الزامی است.' });
    }
    if (!weight) {
      return res.status(400).json({ message: 'وزن محصول الزامی است.' });
    }

    // دریافت قیمت فعلی یک انس نقره از GoldAPI
    const axios = (await import('axios')).default;
    let silverAtCreation = 0;
    try {
      const silverRes = await axios.get('https://www.goldapi.io/api/XAG/USD', {
        headers: {
          'x-access-token': process.env.GOLDAPI_KEY,
          'Content-Type': 'application/json',
        },
      });
      silverAtCreation = silverRes.data.price;
    } catch (err) {
      console.error('خطا در دریافت قیمت نقره:', err.message);
      silverAtCreation = 0;
    }

    const newProduct = new Product({
      productId,
      title,
      price: Number(price),
      silverAtCreation: Number(silverAtCreation),
      description,
      category,
      stock: Number(stock),
      image,
      gallery,
      ringSize: ringSize || '',
      metalType: metalType || '',
      jewelleryType: jewelleryType || '',
      jewellerySize: jewellerySize || '',
      weight: weight || '',
    });

    await newProduct.save();
    res.status(201).json({ message: "محصول با موفقیت اضافه شد.", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "خطا در افزودن محصول.", error: error.message });
  }
};


// حذف محصول با آیدی
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد." });
    }

    await product.deleteOne();
    res.status(200).json({ message: "محصول با موفقیت حذف شد." });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف محصول.", error: error.message });
  }
};


// دریافت لیست همه سفارشات
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate("user", "username email").populate("status").populate('shippingAddress').populate('products.product');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت سفارشات.", error: error.message });
  }
};


// آپدیت وضعیت سفارش ها
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد." });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "وضعیت سفارش با موفقیت به‌روزرسانی شد.", order });
  } catch (error) {
    res.status(500).json({ message: "خطا در به‌روزرسانی وضعیت سفارش.", error: error.message });
  }
};


// دریافت جزئیات سفارش
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // پیدا کردن سفارش با اطلاعات مرتبط
    const order = await Orders.findById(id)
      .populate("user", "username email") // اطلاعات کاربر
      .populate("products.product", "title price quantity image") // اطلاعات محصول
      .populate("shippingAddress"); // اطلاعات آدرس ارسال

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد." });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت جزئیات سفارش.", error: error.message });
  }
};