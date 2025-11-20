import { Router } from "express";
import {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgotPassword,
  verifyResetCode,
  setNewPassword,
  getProfile,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// ثبت‌نام کاربر
router.post("/register", registerUser);

// تایید ایمیل
router.post("/register/verify", verifyUserEmail);

// ورود
router.post("/login", loginUser);

// فراموشی رمز عبور
router.post("/forgot-password", forgotPassword);

// بررسی کد بازیابی
router.post("/reset-password/verifycode", verifyResetCode);

// ست کردن رمز جدید
router.post("/reset-password/setpass", setNewPassword);

// دریافت پروفایل محافظت‌شده و ریدایرکت بر اساس نقش
router.get("/profile", protect, getProfile);

// LogOut
router.post("/logout", logout)

export default router;
