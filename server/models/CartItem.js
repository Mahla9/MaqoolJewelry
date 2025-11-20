// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      image: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
    }
  ],
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);
export default CartItem;