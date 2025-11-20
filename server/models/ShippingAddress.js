// models/ShippingAddress.js
import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: String,
  lastname: String,
  address: String,
  city: String,
  postalCode: String,
  province: String,
  phone: String
}, { timestamps: true });

export default mongoose.model('ShippingAddress', shippingAddressSchema);