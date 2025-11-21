import { Router } from "express";
import { 
  getAllUsers, 
  deleteUserById, 
  addProduct, 
  updateOrderStatus, 
  getAllOrders, 
  deleteProductById, 
  getOrderDetails,
  validateProduct 
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = Router();

// مسیر uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

// ایجاد پوشه اگر وجود نداشت
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// تنظیمات Multer با امنیت بیشتر
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// فیلتر فایل: فقط تصاویر
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فرمت‌های PNG, JPG, JPEG و WebP مجاز هستند'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10
  }
});

// Middleware: فقط ادمین
router.use(protect, adminOnly);

// Routes
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUserById);
router.delete("/products/:id", deleteProductById);

router.post("/products", 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 9 }
  ]),
  validateProduct,
  addProduct
);

router.get("/orders", getAllOrders);
router.patch("/orders/:id", updateOrderStatus);
router.get("/orders/:id", getOrderDetails);

// Error handler برای multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `خطای آپلود: ${err.message}` });
  }
  next(err);
});

export default router;