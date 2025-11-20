import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
import shippingAddressRoutes from './routes/shippingAddressRoutes.js';
import silverRoutes from './routes/silverRoutes.js';

import rateLimit from 'express-rate-limit';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';


const app = express();


dotenv.config();

// ✅ اتصال به دیتابیس
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Middlewareهای پایه امنیتی و منطقی
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet({
  contentSecurityPolicy: false, // اگر نیاز به بارگذاری منابع خارجی دارید
}));
app.use(morgan('dev'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// برای پست داده های حاوی فایل
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
}, express.static('uploads'));

// Middleware برای CSRF
app.use(
  csurf({
    cookie: {
      httpOnly: true, // فقط از طریق HTTP قابل دسترسی است
      secure: false,
      sameSite: "lax", // جلوگیری از ارسال کوکی به دامنه‌های دیگر
    },
  })
);
// محدود کردن تعداد تلاش های ورود
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 5, // حداکثر 5 تلاش
  message: "تعداد تلاش‌های ورود بیش از حد است. لطفاً بعداً دوباره تلاش کنید.",
});
app.use('/api/user/login', loginLimiter);


// مسیر برای دریافت CSRF Token
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "توکن CSRF نامعتبر است." });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.errors[0] });
  }
  next(err);
});

// ✅ API Routes
app.use("/api/admin", adminRoutes);      // فقط برای ادمین‌ها
app.use('/api/user', userRoutes); // مسیرهای عمومی و محافظت‌شده
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shipping', shippingAddressRoutes);
app.use('/api/silver', silverRoutes);


// ✅ Route تست ساده
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});


// هندل خطای 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});


// ✅ هندل خطاها
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ✅ راه‌اندازی سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// اجرای اولیه
// axios.post('http://localhost:5000/api/silver/force-update').catch(() => {});
// هر ۶ ساعت یک بار
// setInterval(() => {
//   axios.post('http://localhost:5000/api/silver/force-update').catch(() => {});
// }, 6 * 60 * 60 * 1000);