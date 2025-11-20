import express from 'express';
import axios from 'axios';
import SilverPrice from '../models/SilverPrice.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/silver/price
router.get('/price', async (req, res) => {
  try {
    // آخرین قیمت ذخیره‌شده را پیدا کن
    const last = await SilverPrice.findOne().sort({ timestamp: -1 });
    const now = new Date();
    const sixHours = 6 * 60 * 60 * 1000;
    if (last && (now - last.timestamp) < sixHours) {
      // اگر کمتر از 6 ساعت گذشته، فقط همان را برگردان
      return res.json({ price: last.price, prevPrice: null, delta: null, cached: true });
    }

    // اگر بیشتر از 6 ساعت گذشته، قیمت جدید بگیر
    const response = await axios.get('https://www.goldapi.io/api/XAG/USD', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json',
      },
    });
    const newPrice = response.data.price;

    // ذخیره قیمت جدید
    const saved = await SilverPrice.create({ price: newPrice });

    // پیدا کردن قیمت قبلی (غیر از همین رکورد جدید)
    const prev = last;
    let delta = null;
    if (prev) {
      delta = newPrice / prev.price;
      // آپدیت قیمت محصولات (مثال: همه محصولات)
      const products = await Product.find();
      for (const product of products) {
        product.price = (product.price * delta);
        await product.save();
      }
    }

    res.json({ price: newPrice, prevPrice: prev?.price, delta, cached: false });
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت یا ذخیره قیمت نقره', details: err.message });
  }
});

// GET /api/silver/force-update
router.post('/force-update', async (req, res) => {
  try {
    // آخرین قیمت ذخیره‌شده را پیدا کن
    const last = await SilverPrice.findOne().sort({ timestamp: -1 });
    const now = new Date();
    const sixHours = 6 * 60 * 60 * 1000;
    if (last && (now - last.timestamp) < sixHours) {
      return res.json({ message: 'هنوز ۶ ساعت از آخرین آپدیت نگذشته است.', updated: false });
    }
    const response = await axios.get('https://www.goldapi.io/api/XAG/USD', {
      headers: {
        'x-access-token': process.env.GOLDAPI_KEY,
        'Content-Type': 'application/json',
      },
    });
    const newPrice = response.data.price;
    await SilverPrice.create({ price: newPrice });
    const prev = last;
    let delta = null;
    if (prev) {
      delta = newPrice / prev.price;
      const products = await Product.find();
      for (const product of products) {
        product.price = (product.price * delta);
        await product.save();
      }
    }
    res.json({ message: 'قیمت نقره و محصولات با موفقیت آپدیت شد.', updated: true });
  } catch (err) {
    res.status(500).json({ error: 'خطا در آپدیت قیمت نقره', details: err.message });
  }
});

export default router;
