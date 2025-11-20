import { Router } from "express";
import { 
  getCart, 
  updateCart, 
  syncCart, 
  addToCart, 
  deleteFromCart,
  clearCart, 
  calculateTotal,
  updateQuantity
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// دریافت و به‌روزرسانی سبد خرید
router.route('/').get(protect, getCart).put(protect, updateCart);

// همگام‌سازی سبد خرید
router.post('/sync', protect, syncCart);

// افزودن محصول به سبد خرید
router.post('/add', protect, addToCart);

// پاک کردن سبد خرید
router.delete('/clear', (req, res, next) => {
  console.log('>>> [DEBUG] /cart/clear route called');
  next();
}, protect, clearCart);

// حذف محصول از سبد خرید
router.delete('/:id', protect, deleteFromCart);

// محاسبه جمع کل
router.get('/total', protect, calculateTotal);

// تغییر تعداد محصول به مقدار دلخواه
router.put('/quantity', protect, updateQuantity);

export default router;