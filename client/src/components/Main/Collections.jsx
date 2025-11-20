import React from 'react';
import ProductCard from '../ProductCard';
import {useGetProducts} from '../../api/productsAPI.js';
import { Navigate } from 'react-router-dom';

function Collections() {
  const { data:AllData, isLoading, error } = useGetProducts();
  const products = AllData?.data?.products;
  

  return (
    <div className='container flex-flex-col justify-between gap-9'>
        <div dir='rtl' className='relative flex items-center md:justify-center pb-9'>
            <button type='button' className='absolute left-0 text-xs md:text-sm lg:text-base text-navyBlue-100 bg-white/60 cursor-pointer transition-all duration-200 ease-in hover:bg-white/80 px-2 md:px-6 py-2 rounded-md '
            onClick={()=><Navigate to={'/products'}/>}  >نمایش همه محصولات
            </button>
            <h2 className=' text-white text-xl md:text-2xl lg:text-4xl'>کالکشن جدید</h2>
        </div>

        <div className='flex flex-wrap md:flex-nowrap items-center gap-6 justify-center'>
            {products?.length>0 && products.map(product=>(
              <ProductCard key={product.productId} product={product}/>
            ))}
        </div>

        {isLoading && <div className=' text-white flex justify-center gap-3'>در حال بارگذاری...
          <span className='animate-spin border-4 border-t-transparent border-white rounded-full w-6 h-6'></span>
        </div>}
        {error && <div className='text-red-300 text-center'>خطا در دریافت محصولات</div>}
    </div>
  )
}

export default Collections;