import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { registerValidation, verifyValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } from "../validations/userValidation.js";
import { hashPassword, comparePasswords, generateToken } from "../services/authService.js";
import { sendEmail } from "../services/emailService.js";
import bcrypt from 'bcryptjs';

// بالای فایل authController.js
const pendingUsers = {};

// تابع کمکی برای یافتن کاربر
const findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    // throw new Error("کاربری با این ایمیل یافت نشد."); // این باعث خطای 500 می‌شود
    const error = new Error("نام کاربری یا رمز اشتباه است");
    error.status = 401;
    throw error;
  }
  return user;
};

// تابع کمکی برای یافتن کاربر
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("کاربری با این ایمیل یافت نشد.");
  }
  return user;
};


// مرحله ۱: ثبت‌نام اولیه و ارسال کد تأیید
export const registerUser = asyncHandler(async (req, res) => {
  await registerValidation.validate(req.body);
  const { username, email, password } = req.body;

  // اگر کاربر قبلاً ثبت‌نام کرده (در دیتابیس اصلی)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است." });
  }

  // تولید کد تأیید
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // ذخیره اطلاعات موقت
  pendingUsers[email] = {
    username,
    email,
    password: await hashPassword(password),
    verificationCode,
    expires: Date.now() + 10 * 60 * 1000 // 10 دقیقه
  };

  // ارسال ایمیل
  await sendEmail({
    to: email,
    subject: "کد تأیید ایمیل",
    text: `کد تأیید شما: ${verificationCode}`,
  });

  res.status(200).json({ message: "کد تأیید به ایمیل ارسال شد." });
});

// مرحله ۲: تأیید ایمیل و ثبت نهایی کاربر
export const verifyUserEmail = asyncHandler(async (req, res) => {
  await verifyValidation.validate(req.body);
  const { email, code } = req.body;
  const pending = pendingUsers[email];

  if (
    !pending ||
    pending.verificationCode !== code ||
    pending.expires < Date.now()
  ) {
    return res.status(400).json({ message: "کد تأیید اشتباه یا منقضی شده است." });
  }

  // ثبت کاربر در دیتابیس اصلی
  const newUser = new User({
    username: pending.username,
    email: pending.email,
    password: pending.password,
    isVerified: true,
  });
  await newUser.save();

  // حذف اطلاعات موقت
  delete pendingUsers[email];

  // تولید توکن
  const token = generateToken(newUser);

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // فقط روی https
  sameSite: "Strict", // یا "Lax" برای حالت سبد خرید و امثالهم
  maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
});

  res.status(201).json({
    message: "ثبت‌نام و تأیید ایمیل با موفقیت انجام شد",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

// ورود کاربر
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // اعتبار سنجی داده های ورودی
  await loginValidation.validate({ username, password });

  const user = await findUserByUsername(username);

  // بررسی رمز عبور
  if (!(await comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "نام کاربری یا رمز اشتباه است" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "حساب هنوز تأیید نشده" });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // فقط روی https
  sameSite: "Strict", // یا "Lax" برای حالت سبد خرید و امثالهم
  maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
});

  res.status(200).json({
    message: "ورود موفقیت‌آمیز بود",
    user: {
      username: user.username,
      email: user.email,
    },
    redirect: user.role === "admin" ? "/admin/cms" : "/dashboard",
  });
});


// مرحله ۱: ارسال کد بازیابی
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordValidation.validate({ email });

  const user = await findUserByEmail(email);

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 دقیقه
  await user.save();

  await sendEmail({
    to: email,
    subject: "کد بازیابی رمز عبور",
    text: `کد شما: ${resetCode}`,
  });

  res.status(200).json({ message: "کد بازیابی به ایمیل ارسال شد." });
});

// مرحله ۲: بررسی صحت کد بازیابی
export const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await findUserByEmail(email);

  if (
    !user.resetPasswordCode ||
    !(await bcrypt.compare(code, user.resetPasswordCode)) ||
    user.resetPasswordExpires < Date.now()
  ) {
    return res.status(400).json({ message: "کد اشتباه یا منقضی شده است" });
  }

  res.status(200).json({ message: "کد صحیح است. حالا رمز جدید را وارد کنید" });
});

// مرحله ۳: ست کردن رمز جدید
export const setNewPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "رمز جدید و تکرار آن مطابقت ندارند" });
  }

  const user = await findUserByEmail(email);

  if (
    !user.resetPasswordCode ||
    !(await bcrypt.compare(code, user.resetPasswordCode)) ||
    user.resetPasswordExpires < Date.now()
  ) {
    return res.status(400).json({ message: "کد اشتباه یا منقضی شده است." });
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({ message: "رمز عبور با موفقیت تغییر یافت." });
});

// دریافت پروفایل کاربر
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "کاربر یافت نشد" });
  }

  res.status(200).json({ user });
});


// خروج کاربر
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict", // یا "Lax"
  });
  res.status(200).json({ message: "خروج موفقیت‌آمیز بود." });
};