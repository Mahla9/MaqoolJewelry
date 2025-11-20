import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetPasswordCode: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// 🔐 هش کردن فیلدهای حساس قبل از ذخیره
userSchema.pre('save', async function (next) {
  const user = this;

  try {
    // هش کردن verificationCode
    if (user.isModified('verificationCode') && user.verificationCode) {
      user.verificationCode = await bcrypt.hash(user.verificationCode, 12);
    }

    // هش کردن resetPasswordCode
    if (user.isModified('resetPasswordCode') && user.resetPasswordCode) {
      user.resetPasswordCode = await bcrypt.hash(user.resetPasswordCode, 12);
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('User', userSchema);