import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    silverWeight: {
      type: Number,
      required: true,
      min: 0.1,
      max: 1000,
    },
    silverPriceAtCreation: {
      type: Number,
      required: true,
      min: 0
    },
    usdPriceAtCreation: {
      type: Number,
      required: true,
      min: 0
    },
    makingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    stoneCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
      validate: [arr => arr.length <= 10, 'حداکثر 10 تصویر مجاز است']
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['انگشتر مردانه', 'انگشتر زنانه', 'گردنبند', 'مدال'],
      index: true,
    },
    ringSize: {
      type: String,
      maxlength: 50,
    },
    metalType: {
      type: String,
      maxlength: 100,
    },
    jewelleryType: {
      type: String,
      maxlength: 100,
    },
    jewellerySize: {
      type: String,
      maxlength: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

// Index ترکیبی برای جستجو
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

export default mongoose.model('Product', productSchema);