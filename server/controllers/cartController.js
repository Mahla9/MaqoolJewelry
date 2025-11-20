import Cart from '../models/CartItem.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت سبد خرید', error: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items },
      { new: true, upsert: true }
    ).populate('items.product');
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'خطا در بروزرسانی سبد خرید', error: err.message });
  }
};

export const addToCart = async (req, res) => {

  try {
    const { id, quantity, image, title, price } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: id, quantity, image, title, price });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'خطا در افزودن محصول به سبد خرید', error: err.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد.' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== id);
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'خطا در حذف محصول از سبد خرید', error: err.message });
  }
};

export const reduceSubTotal = async (req, res) => {
  try {
    const { id } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد.' });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === id);

    if (existingItem) {
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter((item) => item.product.toString() !== id);
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'خطا در کاهش تعداد محصول', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'سبد خرید با موفقیت پاک شد.' });
  } catch (err) {
    res.status(500).json({ message: 'خطا در پاک کردن سبد خرید', error: err.message });
  }
};

export const calculateTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد.' });
    }

    const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = 60000; // هزینه ارسال ثابت
    const total = subtotal + shippingCost;

    res.status(200).json({ subtotal, shippingCost, total });
  } catch (err) {
    res.status(500).json({ message: 'خطا در محاسبه جمع کل', error: err.message });
  }
};



export const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // دریافت آیتم‌های سبد خرید از کلاینت
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // اگر سبد خرید وجود ندارد، یک سبد جدید ایجاد کنید
      cart = new Cart({ user: req.user.id, items });
    } else {
      // اگر سبد خرید وجود دارد، آیتم‌ها را به‌روزرسانی کنید
      cart.items = items;
    }

    await cart.save();
    res.status(200).json({ message: 'سبد خرید با موفقیت همگام‌سازی شد.', cart });
  } catch (err) {
    res.status(500).json({ message: 'خطا در همگام‌سازی سبد خرید', error: err.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'تعداد باید بیشتر از صفر باشد.' });
    }
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد.' });
    }
    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'محصول در سبد خرید یافت نشد.' });
    }
    // بررسی موجودی محصول
    if (quantity > item.product.stock) {
      return res.status(400).json({ message: `موجودی این محصول فقط ${item.product.stock} عدد است.` });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'خطا در تغییر تعداد محصول', error: err.message });
  }
};