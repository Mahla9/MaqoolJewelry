// services/priceUpdateCron.js
import cron from 'node-cron';
import axios from 'axios';
import Product from '../models/Product.js';

const BRS_API_KEY = process.env.BRS_API_KEY;
const BRS_Silver_URL = process.env.BRS_Silver_URL;
const BRS_USD_URL = process.env.BRS_USD_URL
const SILVER_OUNCE_TO_GRAM = 31.1035;

// دریافت قیمت نقره
const fetchSilverPrice = async () => {
  try {
    const response = await axios.get(BRS_Silver_URL, {
      params: { key: BRS_API_KEY },
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
    console.error('❌ خطا در دریافت قیمت نقره:', error.message);
    return null;
  }
};

// دریافت قیمت دلار
const fetchUSDPrice = async () => {
  try {
    const response = await axios.get(BRS_USD_URL, {
      params: { key: BRS_API_KEY },
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
    console.error('❌ خطا در دریافت قیمت دلار:', error.message);
    return null;
  }
};

// محاسبه قیمت محصول
const calculatePrice = (silverWeight, silverPricePerGram, makingFee, stoneCost) => {
  const silverCost = silverWeight * silverPricePerGram;
  const totalPrice = silverCost + makingFee + stoneCost;
  return Math.ceil(totalPrice / 1000) * 1000;
};

// آپدیت قیمت همه محصولات
export const updateAllProductPrices = async () => {
  try {
    console.log('🔄 شروع آپدیت قیمت محصولات...');

    const [silverOunceUSD, usdToToman] = await Promise.all([
      fetchSilverPrice(),
      fetchUSDPrice()
    ]);

    if (!silverOunceUSD || !usdToToman) {
      console.error('❌ خطا در دریافت قیمت‌ها');
      return;
    }

    const silverPricePerGram = (silverOunceUSD * usdToToman) / SILVER_OUNCE_TO_GRAM;

    const products = await Product.find({ isActive: true });
    let updatedCount = 0;

    for (const product of products) {
      if (product.silverWeight > 0) {
        const newPrice = calculatePrice(
          product.silverWeight,
          silverPricePerGram,
          product.makingFee || 0,
          product.stoneCost || 0
        );

        product.price = newPrice;
        product.silverPriceAtCreation = silverOunceUSD;
        product.usdPriceAtCreation = usdToToman;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`✅ ${updatedCount} محصول آپدیت شد`);
    console.log(`📊 قیمت اونس نقره: $${silverOunceUSD.toFixed(2)}`);
    console.log(`📊 قیمت دلار: ${usdToToman.toLocaleString('fa-IR')} تومان`);
    console.log(`📊 قیمت هر گرم نقره: ${Math.round(silverPricePerGram).toLocaleString('fa-IR')} تومان`);
  } catch (error) {
    console.error('❌ خطا در آپدیت قیمت‌ها:', error.message);
  }
};

// راه‌اندازی Cron Job (هر 6 ساعت)
export const startPriceUpdateCron = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Cron Job اجرا شد:', new Date().toLocaleString('fa-IR'));
    await updateAllProductPrices();
  });

  console.log('✅ Cron Job راه‌اندازی شد (هر 6 ساعت)');
  
  // اجرای اولیه
  updateAllProductPrices();
};