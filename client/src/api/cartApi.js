import axios from '../lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';



// دریافت سبد خرید
const fetchCartItems = async () => {
  const response = await axios.get('/cart');
  return response.data;
};

// افزودن یا افزایش تعداد محصول
const addOrUpdateCartItem = async ({ productId, quantity }) => {
  await axios.post('/cart/add', { productId, quantity });
};

// کاهش تعداد محصول
const reduceCartItem = async (productId) => {
  await axios.post('/cart/reduce', { productId });
};

// حذف محصول از سبد خرید
const deleteCartItem = async (productId) => {
  await axios.delete(`/cart/${productId}`);
};

// استفاده از سبد خرید
export const useCartItems = () => {
  return useQuery({
    queryKey: ['cartItems'],
    queryFn: fetchCartItems,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Error fetching cart items:', error);
    },
  });
};

// استفاده از افزودن یا افزایش تعداد محصول
export const useAddOrUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation(addOrUpdateCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('cartItems'); // بازخوانی داده‌های سبد خرید
    },
  });
};

// استفاده از کاهش تعداد محصول
export const useReduceCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation(reduceCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('cartItems'); // بازخوانی داده‌های سبد خرید
    },
  });
};

// استفاده از حذف محصول
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('cartItems'); // بازخوانی داده‌های سبد خرید
    },
  });
};