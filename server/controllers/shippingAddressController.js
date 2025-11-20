// 📁 controllers/shippingAddressController.js
import ShippingAddress from '../models/ShippingAddress.js';

export async function addShippingAddress(req, res) {
  try {
    const newAddress = new ShippingAddress({ ...req.body, user: req.user.id });
    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'خطا در ذخیره آدرس', error: err.message });
  }
}

export async function getShippingAddresses(req, res) {
  try {
    const addresses = await ShippingAddress.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت آدرس‌ها', error: err.message });
  }
}

export async function updateShippingAddress(req, res) {
  try {
    const { id } = req.params;
    const updated = await ShippingAddress.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'آدرس پیدا نشد' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'خطا در ویرایش آدرس', error: err.message });
  }
}

export async function deleteShippingAddress(req, res) {
  try {
    const { id } = req.params;
    const deleted = await ShippingAddress.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'آدرس پیدا نشد' });
    res.status(200).json({ message: 'آدرس با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ message: 'خطا در حذف آدرس', error: err.message });
  }
}