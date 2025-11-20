import Orders from '../models/Orders.js';

export const createOrder = async (req, res) => {
  try {
    const newOrder = new Orders({ ...req.body, user: req.user.id, shippingAddress: req.body.shippingAddress });
    const saved = await newOrder.save();
    await saved.populate('shippingAddress');
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'خطا در ثبت سفارش', error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.user.id })
      .populate('shippingAddress')
      .populate('products.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت سفارشات', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findOne({ _id: req.params.id, user: req.user.id })
      .populate('shippingAddress')
      .populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'سفارش پیدا نشد' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت سفارش', error: err.message });
  }
};
