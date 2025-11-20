import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const comparePasswords = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

export const generateToken = (user) => {
  console.log('JWT_SECRET in generateToken:', process.env.JWT_SECRET);
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
