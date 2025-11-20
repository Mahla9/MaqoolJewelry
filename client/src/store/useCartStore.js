import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import useAuthStore from "./useAuthStore";
import { toast } from "react-toastify";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      // دریافت وضعیت لاگین از useAuthStore
      isLoggedIn: useAuthStore.getState().isLoggedIn,
      totalPrice: 0,
      shippingCost: 0,
      subtotalPrice: 0,
      orderSuccess: null,

      calculatePrices: async () => {
        try {
          const res = await axios.get('/cart/total');
          const { subtotal, shippingCost, total } = res.data;
          set({ totalPrice: total, shippingCost, subtotalPrice: subtotal });
        } catch (error) {
          console.error("Error calculating prices:", error);
        }
      },
      setOrderSuccess: (order) => {
        set({ orderSuccess: order });
      },

      // تنظیم سبد خرید
      setCart: async (newData) => {
        const isLoggedIn = get().isLoggedIn;

        if (isLoggedIn) {
          // اگر کاربر لاگین کرده باشد، داده‌ها را از سرور دریافت کنید
          try {
            const response = await axios.get("/cart");   
            set({ cart: response.data.items });
          } catch (error) {
            console.error("خطا در دریافت سبد خرید از سرور:", error);
          }
        } else {
          // اگر کاربر لاگین نکرده باشد، داده‌های محلی را تنظیم کنید
          set({ cart: newData });
        }
      },

      // افزودن محصول به سبد خرید
      addToCart: async (newItem) => {
        const isLoggedIn = get().isLoggedIn;

        if (isLoggedIn) {
          // کاربر لاگین کرده: ارسال درخواست به سرور
          try {
            await axios.post(`/cart/add`, {
              id: newItem._id,
              price: newItem.price,
              title: newItem.title,
              image: newItem.image,
              quantity: 1,
            });
            toast.success("محصول با موفقیت به سبد خرید اضافه شد")
          } catch (error) {
            const ErrMessage = error.response?.data.message;
            toast.error(ErrMessage)
          }
        } else {
          // کاربر غیرلاگین: مدیریت محلی
          const existItem = get().cart.find(
            (item) => item.productId === newItem.productId
          );
          if (existItem) {
            // افزایش تعداد فقط در حالت محلی
            set({
              cart: get().cart.map((item) =>
                item.productId === newItem.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
          } else {
            set({ cart: [...get().cart, { ...newItem, quantity: 1 }] });
          }
          toast.success("محصول با موفقیت به سبد خرید اضافه شد ");
        }
      },

      // افزایش تعداد محصول
      addQuantity: async (productId) => {
        const isLoggedIn = get().isLoggedIn;

        if (isLoggedIn) {
          // کاربر لاگین کرده: ارسال درخواست به سرور
          await axios.put(`/cart/add`, { productId });
        } else {
          // کاربر غیرلاگین: مدیریت محلی
          set({
            cart: get().cart.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        }
      },


      // حذف محصول از سبد خرید
      deleteFromCart: async (id) => {
        const isLoggedIn = get().isLoggedIn;

        if (isLoggedIn) {
          try {
            // کاربر لاگین کرده: ارسال درخواست به سرور
            await axios.delete(`/cart/${id}`);
            // بعد از حذف، سبد خرید را مجدد بگیر
            const response = await axios.get("/cart");
            set({ cart: response.data.items });
            toast.success("محصول از سبد خرید حذف شد")
          } catch (error) {
            const errMessage = error.response?.data.message;
            toast.error(errMessage);
          }
        } else {
          // کاربر غیرلاگین: مدیریت محلی
          set({
            cart: get().cart.filter((item) => item._id !== id),
          });
        }
      },

      // پاک کردن سبد خرید
      clearCart: async () => {
        if(get().isLoggedIn) {
          try {
            const res = await axios.delete('/cart/clear');
            set({ cart: res.data.items });
            return { success: true, message: res.data.message || 'سبد خرید با موفقیت پاک شد' };
          } catch (error) {
            const ErrMessage = error?.response?.data.message || 'خطا در پاک کردن سبد خرید';
            return { success: false, message: ErrMessage };
          }
        } else{
          set({ cart: [] });
          return { success: true, message: 'سبد خرید با موفقیت پاک شد' };
        }
      },

      // سینک سبد خرید به سرور هنگام لاگین
      syncCartToServer: async () => {
        const cart = get().cart; // دریافت سبد خرید از استور
        if (cart.length === 0) return; // اگر سبد خرید خالی است، نیازی به انتقال نیست

        try {
          await axios.post("/cart/sync", { items: cart });
          get().clearCart(); // پاک کردن سبد خرید از localStorage
          toast.success('انتقال سبد خرید به پایگاه داده با موفقیت انجام شد')
        } catch (error) {
          console.error("خطا در انتقال سبد خرید به سرور:", error);
          toast.error('انتقال سبد خرید به پایگاه داده با شکست مواجه شد')
        }
      },

      // تغییر تعداد محصول به مقدار دلخواه
      updateQuantity: async (id, quantity) => {
        const isLoggedIn = get().isLoggedIn;
        if (isLoggedIn) {
          try {
            await axios.put(`/cart/quantity`, { id, quantity });
            // بعد از تغییر، سبد خرید را مجدد بگیر
            const response = await axios.get("/cart");
            set({ cart: response.data.items });
          } catch (error) {
            const errMessage = error.response?.data.message;
            toast.error(errMessage);
          }
        } else {
          set({
            cart: get().cart.map((item) =>
              item._id === id ? { ...item, quantity } : item
            ),
          });
        }
      },
    }),
    {
      name: "cart", // ذخیره در localStorage
      partialize: (state) => (!state.isLoggedIn ? state.cart : {}), // فقط در حالت غیرلاگین ذخیره شود
    }
  )
);

export default useCartStore;