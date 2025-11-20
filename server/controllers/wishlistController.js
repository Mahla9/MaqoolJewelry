import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items');
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت ویشلست', error: err.message });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const updated = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { items: req.body.items },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'خطا در آپدیت ویشلست', error: err.message });
  }
};