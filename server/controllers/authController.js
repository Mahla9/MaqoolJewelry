import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { 
  registerValidation, 
  verifyValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} from "../validations/userValidation.js";
import { hashPassword, comparePasswords, generateToken } from "../services/authService.js";
import { sendEmail } from "../services/emailService.js";
import bcrypt from 'bcryptjs';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Sanitize ورودی
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(validator.escape(input.trim()));
};

// ذخیره موقت با TTL (Time To Live)
const pendingUsers = new Map();

// پاک‌سازی خودکار کاربران منقضی شده
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingUsers.entries()) {
    if (data.expires < now) {
      pendingUsers.delete(email);
    }
  }
}, 5 * 60 * 1000); // هر 5 دقیقه


// تابع یافتن کاربر با username
const findUserByUsername = async (username) => {
  const sanitized = sanitizeInput(username);
  const user = await User.findOne({ username: sanitized }).select('+password');
  if (!user) {
    const error = new Error("نام کاربری یا رمز اشتباه است");
    error.status = 401;
    throw error;
  }
  return user;
};

// تابع یافتن کاربر با email
const findUserByEmail = async (email) => {
  const sanitized = sanitizeInput(email);
  if (!validator.isEmail(sanitized)) {
    throw new Error("فرمت ایمیل نامعتبر است");
  }
  const user = await User.findOne({ email: sanitized });
  if (!user) {
    throw new Error("کاربری با این ایمیل یافت نشد");
  }
  return user;
};

// ثبت‌نام اولیه
export const registerUser = asyncHandler(async (req, res) => {
  // Validation
  await registerValidation.validate(req.body, { abortEarly: false });
  
  const username = sanitizeInput(req.body.username);
  const email = sanitizeInput(req.body.email);
  const password = req.body.password;

  // بررسی ایمیل valid
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "فرمت ایمیل نامعتبر است" });
  }

  // بررسی وجود کاربر
  const [existingByEmail, existingByUsername] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username })
  ]);

  if (existingByEmail) {
    return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
  }

  if (existingByUsername) {
    return res.status(400).json({ message: "این نام کاربری قبلاً استفاده شده است" });
  }

  // تولید کد تأیید 6 رقمی
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash کردن کد برای امنیت بیشتر
  const hashedCode = await bcrypt.hash(verificationCode, 10);

  // ذخیره موقت
  pendingUsers.set(email, {
    username,
    email,
    password: await hashPassword(password),
    verificationCode: hashedCode,
    expires: Date.now() + 10 * 60 * 1000 // 10 دقیقه
  });

  // ارسال ایمیل
  try {
    await sendEmail({
      to: email,
      subject: "کد تأیید ایمیل",
      html: `
        <div dir="rtl" style="font-family: Tahoma;">
          <h2>کد تأیید شما</h2>
          <p>کد تأیید: <strong>${verificationCode}</strong></p>
          <p>این کد تا 10 دقیقه دیگر معتبر است.</p>
        </div>
      `
    });

    res.status(200).json({ message: "کد تأیید به ایمیل شما ارسال شد" });
  } catch (error) {
    pendingUsers.delete(email);
    console.error('❌ خطا در ارسال ایمیل:', error);
    res.status(500).json({ message: "خطا در ارسال ایمیل" });
  }
});

// تأیید ایمیل
export const verifyUserEmail = asyncHandler(async (req, res) => {
  await verifyValidation.validate(req.body);
  
  const email = sanitizeInput(req.body.email);
  const code = sanitizeInput(req.body.code);

  const pending = pendingUsers.get(email);

  if (!pending) {
    return res.status(400).json({ message: "کد منقضی شده یا نامعتبر است" });
  }

  if (pending.expires < Date.now()) {
    pendingUsers.delete(email);
    return res.status(400).json({ message: "کد منقضی شده است" });
  }

  // بررسی کد
  const isValidCode = await bcrypt.compare(code, pending.verificationCode);
  if (!isValidCode) {
    return res.status(400).json({ message: "کد تأیید اشتباه است" });
  }

  // ثبت کاربر
  const newUser = new User({
    username: pending.username,
    email: pending.email,
    password: pending.password,
    isVerified: true,
  });
  await newUser.save();

  pendingUsers.delete(email);

  const token = generateToken(newUser);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "ثبت‌نام با موفقیت انجام شد",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

// ورود کاربر
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  await loginValidation.validate({ username, password });

  const user = await findUserByUsername(username);

  if (!(await comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "نام کاربری یا رمز اشتباه است" });
  }

  if (!user.isVerified) {
    return res.status(403).json({ message: "حساب هنوز تأیید نشده است" });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "ورود موفق",
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
    redirect: user.role === "admin" ? "/admin/cms" : "/dashboard",
  });
});

// فراموشی رمز
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordValidation.validate({ email });

  const user = await findUserByEmail(email);

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordCode = await bcrypt.hash(resetCode, 10);
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail({
    to: email,
    subject: "کد بازیابی رمز عبور",
    html: `
      <div dir="rtl" style="font-family: Tahoma;">
        <h2>بازیابی رمز عبور</h2>
        <p>کد بازیابی: <strong>${resetCode}</strong></p>
        <p>این کد تا 10 دقیقه معتبر است.</p>
      </div>
    `
  });

  res.status(200).json({ message: "کد بازیابی به ایمیل ارسال شد" });
});

// بررسی کد بازیابی
export const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await findUserByEmail(email);

  if (!user.resetPasswordCode || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: "کد منقضی شده است" });
  }

  const isValid = await bcrypt.compare(code, user.resetPasswordCode);
  if (!isValid) {
    return res.status(400).json({ message: "کد اشتباه است" });
  }

  res.status(200).json({ message: "کد صحیح است" });
});

// تنظیم رمز جدید
export const setNewPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "رمزها مطابقت ندارند" });
  }

  const user = await findUserByEmail(email);

  if (!user.resetPasswordCode || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: "کد منقضی شده است" });
  }

  const isValid = await bcrypt.compare(code, user.resetPasswordCode);
  if (!isValid) {
    return res.status(400).json({ message: "کد اشتباه است" });
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.status(200).json({ message: "رمز با موفقیت تغییر یافت" });
});

// دریافت پروفایل
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -resetPasswordCode -resetPasswordExpires");
    
  if (!user) {
    return res.status(404).json({ message: "کاربر یافت نشد" });
  }

  res.status(200).json({ user });
});

// خروج
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "خروج موفق" });
};