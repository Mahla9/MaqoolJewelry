// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingAddress",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["درحال بررسی", "آماده سازی", "ارسال شد", "دریافت شد", "کنسل شد"],
    default: "درحال بررسی",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Orders", orderSchema);