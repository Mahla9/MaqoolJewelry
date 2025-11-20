import axios from '../lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useGetShippingAddresses = () => {
  return useQuery({
    queryKey: ['shippingAddresses'],
    queryFn: () => axios.get('/shipping').then(res => res.data)
  });
};

export const useAddShippingAddress = () => {
  return useMutation({
    mutationFn: (newAddress) => axios.post('/shipping', newAddress)
  });
};

export const useUpdateShippingAddress = () => {
  return useMutation({
    mutationFn: (updatedAddress) => axios.patch(`/shipping/${updatedAddress.id}`, updatedAddress)
  });
};

export const useDeleteShippingAddress = () => {
  return useMutation({
    mutationFn: (id) => axios.delete(`/shipping/${id}`)
  });
};