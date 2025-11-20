import axios from '../lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData) => axios.post('/orders', orderData)
  });
};


export const useGetUserOrders = () => {
  return useQuery({
    queryKey: ['userOrders'],
    queryFn: () => axios.get('/orders/dashboard').then(res => res.data)
  });
};

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ['allOrders'],
    queryFn: () => axios.get('/admin/orders').then(res => res.data)
  });
}

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, status }) => axios.patch(`/admin/orders/${orderId}`, { status })
  });
};

export const useGetOrderById = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => axios.get(`/orders/${orderId}`).then(res => res.data),
    enabled: !!orderId
  });
};