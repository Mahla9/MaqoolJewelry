import React from 'react'
import { useGetProducts } from '../../api/productsAPI';
import { useDeleteProduct } from '../../api/productsAPI';
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

function ProductList() {
    const { data, isPending, error } = useGetProducts();
    const deleteProduct = useDeleteProduct();
    const products = data?.data.products;
    const queryClient = useQueryClient();

    const handleDelete = (productId) => {
        deleteProduct.mutate(productId, {
            onSuccess: () => {
                toast.success('محصول با موفقیت حذف شد');
                // Refetch products after delete
                // useGetProducts returns a query, so we can use its queryClient
                queryClient.invalidateQueries(['products']);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message)
            }
        });
    }

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className='flex flex-col gap-5' dir='rtl'>
          {products?.length>0 && products.map(product => (
            <div key={product.productId} className='border border-slate-400 p-4 rounded-md px-6 py-4 flex justify-between items-center gap-5'>
                <div className='flex items-center gap-3'>
                    <div className='w-28 h-28 flex items-center bg-slate-50'>
                        <img src={`/${product.image.replace(/\\/g, '/')}`} alt={product.title} className='object-contain'/>
                    </div>
                    <div>
                        <h3>{product.title}</h3>
                        <p>قیمت: {(product.price).toLocaleString('en-IR')} تومان</p>
                    </div>
                </div>

                <div>
                    <Trash2 onClick={()=>handleDelete(product._id)} className={`cursor-pointer ${deleteProduct.isPending ? "text-red-400/70" : "text-red-600"}`}/>

                </div>
            </div>
          ))}
        </div>
    )
}

export default ProductList;