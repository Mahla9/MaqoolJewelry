import { Router } from "express";
import { getAllUsers, deleteUserById, addProduct, updateOrderStatus, getAllOrders, deleteProductById, getOrderDetails } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // ذخیره با پسوند اصلی
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });


// فقط ادمین به این مسیرها دسترسی داره
router.use(protect, adminOnly);

// لیست همه کاربران
router.get("/users", getAllUsers);

// حذف کاربر خاص
router.delete("/users/:id", deleteUserById);

// حذف محصول خاص
router.delete("/products/:id", deleteProductById);

// افزودن محصول
router.post("/products", upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 9 }
]), addProduct);

// لیست همه سفارشات
router.get("/orders", getAllOrders);

// تغییر وضعیت سفارش
router.patch("/orders/:id", updateOrderStatus);

// نمایش جزئیات سفارش
router.get("/orders/:id", getOrderDetails);

export default router;
