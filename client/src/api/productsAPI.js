import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';

export const useSendProduct = () => {
    return useMutation({
        mutationFn: (product) => axios.post('/admin/products', product)
    })
}

export const useGetProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => axios.get('/products')
    })
}


export const useDeleteProduct = () => {
    return useMutation({
        mutationFn: (productId) => axios.delete(`/admin/products/${productId}`)
    })
}