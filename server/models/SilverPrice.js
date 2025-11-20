import mongoose from 'mongoose';

const silverPriceSchema = new mongoose.Schema({
  price: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('SilverPrice', silverPriceSchema);
