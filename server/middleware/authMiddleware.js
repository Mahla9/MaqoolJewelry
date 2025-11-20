
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// محافظت از مسیرها (برای کاربر لاگین‌کرده)
export const protect = async (req, res, next) => {

  const token = req.cookies?.token;
  if(!token) return res.status(401).json({ message: "توکن وجود نداره" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // ذخیره اطلاعات کاربر در req
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبره" });
  }
};

// کنترل سطح دسترسی admin
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "دسترسی محدود: فقط ادمین" });
  }
  next();
};
