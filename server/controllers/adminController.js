import User from "../models/User.js";
import Product from '../models/Product.js';
import Orders from "../models/Orders.js";
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// تابع Sanitize برای جلوگیری از XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(validator.escape(input.trim()));
};

// Validation rules برای محصول
export const validateProduct = [
  body('title').trim().notEmpty().withMessage('عنوان الزامی است').isLength({ max: 200 }),
  body('description').trim().notEmpty().isLength({ max: 2000 }),
  body('category').trim().isIn(['انگشتر مردانه', 'انگشتر زنانه', 'گردنبند', 'مدال']),
  body('stock').isInt({ min: 0 }).toInt(),
  body('silverWeight').isFloat({ min: 0.1, max: 1000 }).toFloat().withMessage('وزن نقره باید بین 0.1 تا 1000 گرم باشد'),
  body('makingFee').optional().isFloat({ min: 0 }).toFloat(),
  body('stoneCost').optional().isFloat({ min: 0 }).toFloat(),
  body('ringSize').optional().trim().isLength({ max: 50 }),
  body('metalType').optional().trim().isLength({ max: 100 }),
  body('jewelleryType').optional().trim().isLength({ max: 100 }),
  body('jewellerySize').optional().trim().isLength({ max: 50 }),
];

// دریافت قیمت نقره از BRS API
const fetchSilverPriceFromBRS = async () => {
  try {
    const response = await axios.get(process.env.BRS_URL, {
      params: { key: process.env.BRS_API_KEY },
      timeout: 20000,
    });

    if (response.data && response.data.metal_precious) {
      const silverData = response.data.metal_precious.find(
        item => item.symbol && item.symbol.toUpperCase() === 'XAGUSD'
      );
      return silverData ? parseFloat(silverData.price) : null;
    }
    return null;
  } catch (error) {
    console.error('❌ خطا در دریافت قیمت نقره از BRS:', error.message);
    return null;
  }
};

// دریافت قیمت دلار از BRS API
const fetchUSDToTomanFromBRS = async () => {
  try {
    const response = await axios.get(process.env.BRS_URL, {
      params: { key: process.env.BRS_API_KEY },
      timeout: 20000,
    });

    if (response.data && response.data.currency) {
      const usdData = response.data.currency.find(
        item => item.symbol && item.symbol.toUpperCase() === 'USD'
      );
      return usdData ? parseFloat(usdData.price) : null;
    }
    return null;
  } catch (error) {
    console.error('❌ خطا در دریافت قیمت دلار از BRS:', error.message);
    return null;
  }
};

// محاسبه قیمت محصول (مشابه کد PHP)
const calculateProductPrice = (silverWeight, silverPricePerGram, makingFee, stoneCost) => {
  const silverCost = silverWeight * silverPricePerGram;
  const totalPrice = silverCost + makingFee + stoneCost;
  // گرد کردن به نزدیکترین هزار تومان
  return Math.ceil(totalPrice / 1000) * 1000;
};

// دریافت لیست همه کاربران
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -resetPasswordCode -resetPasswordExpires")
      .limit(100) // محدودیت تعداد
      .lean(); // بهینه‌سازی کوئری
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('❌ خطا در دریافت کاربران:', error);
    res.status(500).json({ message: "خطا در دریافت لیست کاربران" });
  }
};

// حذف کاربر با آیدی
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation ID
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "کاربر پیدا نشد" });
    }

    // جلوگیری از حذف ادمین
    if (user.role === 'admin') {
      return res.status(403).json({ message: "امکان حذف ادمین وجود ندارد" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "کاربر با موفقیت حذف شد" });
  } catch (error) {
    console.error('❌ خطا در حذف کاربر:', error);
    res.status(500).json({ message: "خطا در حذف کاربر" });
  }
};

// ایجاد یک محصول جدید
export const addProduct = async (req, res) => {
  try {
    // بررسی خطاهای validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    // Sanitize ورودی‌ها
    const {
      title,
      description,
      category,
      stock,
      silverWeight,
      makingFee = 0,
      stoneCost = 0,
      ringSize = '',
      metalType = '',
      jewelleryType = '',
      jewellerySize = '',
    } = req.body;

    const sanitizedData = {
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      category: sanitizeInput(category),
      stock: parseInt(stock, 10),
      silverWeight: parseFloat(silverWeight),
      makingFee: parseFloat(makingFee),
      stoneCost: parseFloat(stoneCost),
      ringSize: sanitizeInput(ringSize),
      metalType: sanitizeInput(metalType),
      jewelleryType: sanitizeInput(jewelleryType),
      jewellerySize: sanitizeInput(jewellerySize),
    };

    // بررسی فایل‌ها
    if (!req.files || !req.files['image'] || !req.files['image'][0]) {
      return res.status(400).json({ message: 'تصویر اصلی محصول الزامی است' });
    }

    const image = req.files['image'][0].path;
    const gallery = req.files['gallery'] ? req.files['gallery'].map(f => f.path) : [];

    // دریافت قیمت نقره و دلار
    const [silverOunceUSD, usdToToman] = await Promise.all([
      fetchSilverPriceFromBRS(),
      fetchUSDToTomanFromBRS()
    ]);

    if (!silverOunceUSD || !usdToToman) {
      return res.status(503).json({ 
        message: 'خطا در دریافت قیمت‌های لحظه‌ای. لطفاً دوباره تلاش کنید' 
      });
    }

    // تبدیل قیمت اونس به گرم و تومان
    const SILVER_OUNCE_TO_GRAM = 31.1035;
    const silverPricePerGram = (silverOunceUSD * usdToToman) / SILVER_OUNCE_TO_GRAM;

    // محاسبه قیمت نهایی
    const finalPrice = calculateProductPrice(
      sanitizedData.silverWeight,
      silverPricePerGram,
      sanitizedData.makingFee,
      sanitizedData.stoneCost
    );

    // ایجاد محصول
    const productId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newProduct = new Product({
      productId,
      title: sanitizedData.title,
      price: finalPrice,
      silverWeight: sanitizedData.silverWeight,
      silverPriceAtCreation: silverOunceUSD, // قیمت اونس دلاری در زمان ثبت
      usdPriceAtCreation: usdToToman, // قیمت دلار در زمان ثبت
      makingFee: sanitizedData.makingFee,
      stoneCost: sanitizedData.stoneCost,
      description: sanitizedData.description,
      category: sanitizedData.category,
      stock: sanitizedData.stock,
      image,
      gallery,
      ringSize: sanitizedData.ringSize,
      metalType: sanitizedData.metalType,
      jewelleryType: sanitizedData.jewelleryType,
      jewellerySize: sanitizedData.jewellerySize,
    });

    await newProduct.save();

    res.status(201).json({ 
      message: "محصول با موفقیت اضافه شد",
      product: {
        id: newProduct._id,
        title: newProduct.title,
        price: newProduct.price,
        silverPricePerGram: Math.round(silverPricePerGram),
      }
    });
  } catch (error) {
    console.error('❌ خطا در افزودن محصول:', error);
    res.status(500).json({ message: "خطا در افزودن محصول", error: error.message });
  }
};

// حذف محصول با آیدی
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "محصول با موفقیت حذف شد" });
  } catch (error) {
    console.error('❌ خطا در حذف محصول:', error);
    res.status(500).json({ message: "خطا در حذف محصول" });
  }
};

// دریافت لیست همه سفارشات
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const orders = await Orders.find()
      .populate("user", "username email")
      .populate("shippingAddress")
      .populate("products.product", "title price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Orders.countDocuments();

    res.status(200).json({ 
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ خطا در دریافت سفارشات:', error);
    res.status(500).json({ message: "خطا در دریافت سفارشات" });
  }
};

// آپدیت وضعیت سفارش
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const validStatuses = ["درحال بررسی", "آماده سازی", "ارسال شد", "دریافت شد", "کنسل شد"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "وضعیت نامعتبر است" });
    }

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    order.status = sanitizeInput(status);
    await order.save();

    res.status(200).json({ 
      message: "وضعیت سفارش با موفقیت به‌روزرسانی شد",
      order: {
        id: order._id,
        status: order.status
      }
    });
  } catch (error) {
    console.error('❌ خطا در آپدیت وضعیت:', error);
    res.status(500).json({ message: "خطا در به‌روزرسانی وضعیت سفارش" });
  }
};

// دریافت جزئیات سفارش
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({ message: "شناسه نامعتبر است" });
    }

    const order = await Orders.findById(id)
      .populate("user", "username email")
      .populate("products.product", "title price image")
      .populate("shippingAddress")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('❌ خطا در دریافت جزئیات:', error);
    res.status(500).json({ message: "خطا در دریافت جزئیات سفارش" });
  }
};