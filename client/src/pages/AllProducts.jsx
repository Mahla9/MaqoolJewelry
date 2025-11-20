import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProductCard from '../components/ProductCard';
import { useGetProducts } from '../api/productsAPI';
import ContactUs from '../components/Main/ContactUsFooter';

function AllProducts() {
    const { data:AllData, isLoading, error } = useGetProducts();
    const products = AllData?.data?.products;
  return (
    <div>
        <div className='bg-navyBlue-200 pb-9'><Header/></div>

        <div className='my-6 flex flex-wrap md:flex-nowrap items-center gap-6 justify-center'>
            {products?.length>0 && products.map(product=>(
              <ProductCard key={product._id} product={product}/>
            ))}
        </div>

        {isLoading && <div className='animate-spin w-6 h-6 text-white border-2 border-y-transparent rounded-full'>در حال بارگذاری...</div>}
        {error && <div className='text-white'>خطا در دریافت محصولات</div>}

        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default AllProducts
