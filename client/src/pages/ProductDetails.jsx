import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useGetProducts } from '../api/productsAPI';
import { useParams } from 'react-router-dom';
import { ArrowBigDown, Heart } from 'lucide-react';
import ContactUs from '../components/Main/ContactUsFooter'
import useCartStore from '../store/useCartStore';

function ProductDetails() {
  const { data:AllData, isLoading, error } = useGetProducts();
      const {id} = useParams();
      const product = AllData?.data?.products.find(p=>p._id === id);
      const addToCart = useCartStore(state => state.addToCart);

  return (
    <>
    <div className='bg-navyBlue-200 pb-9'><Header/></div>
    <div className='min-h-screen bg-custom-silver flex flex-col' dir='rtl'>
        
        {isLoading && 
          <div className='flex gap-3 justify-center items-center my-6 text-slate-700'>
            <span className='animate-spin h-6 w-6 rounded-full border-4 border-t-transparent border-navyBlue-100'></span>
            در حال بارگذاری محصول
          </div>
        }
        {error && <div className='flex justify-center items-center text-navyBlue-100 font-semibold'>خطای اتصال شبکه</div>}
        {product && (
          <>
          <div className=' bg-white rounded-xl px-4 py-9 flex flex-col items-center gap-8 md:flex-row md:items-start'>
            <div className='basis-1/3 grid container grid-cols-1 gap-6 border-l border-l-slate-300'>
              <img className='row-span-3 object-contain rounded-md' src={`/${product.image.replace(/\\/g, '/')}`} alt={`original photo - ${product.title}`} />
              <div className='row-span-1 flex gap-3 overflow-x-auto rounded-lg pb-2 bg-slate-100 last:border-r-0 first:border-r-0'>
                {product.gallery.map((item, index)=>(
                  <img key={index} src={`/${item.replace(/\\/g, '/')}`} alt={`${product.title} ${index+1}`} className='w-32 object-contain border-r border-slate-300'/>
                ))}
              </div>
            </div>

            <div className='basis-2/3 flex flex-col gap-3 justify-around items-start'>
                <div className='flex items-center md:flex-col md:gap-6 w-full md:items-start'>
                  <h2 className='text-lg md:text-2xl md:w-[60%] font-bold text-navyBlue-100 border-l md:border-l-0 md:border-b md:border-slate-500 pl-3 md:pl-0 md:pb-3'>{product.title}</h2>
                  <span className='text-slate-500 text-xs font-semibold px-6'>دسته بندی: {product.category}</span>
                  <div className='flex gap-3 items-center'>
                    <Heart className='cursor-pointer md:size-9 stroke-[1.5px] text-slate-600 transition-all ease-in duration-200 hover:text-green-600'/>
                    <span className='text-nowrap text-xs text-navyBlue-100 font-semibold'>افزودن به علاقه مندی ها</span>
                  </div>

                  {/* attributes */}
                  <div className='flex flex-col gap-3'>
                    <h2 className='text-navyBlue-100 font-semibold'>ویژگی های محصول</h2>
                    {product.ringSize && (
                      <span>
                        سایز حلقه: {product.ringSize}
                      </span>
                    )}
                    
                    {product.metalType && (
                      <span>
                        نوع فلز: {product.metalType}
                      </span>
                    )}

                    {product.jewelleryType && (
                      <span>
                        نوع نگین: {product.jewelleryType}
                      </span>
                    )}

                    {product.jewellerySize && (
                      <span>
                        سایز نگین: 
                        {product.jewellerySize}
                      </span>
                    )}

                    <span>
                      وزن محصول: {product.weight}
                    </span>
                  </div>

                  <a href='#description' className='font-semibold text-slate-400 flex cursor-pointer'>توضیحات بیشتر <ArrowBigDown/></a>
                </div>
                <div className='flex flex-col items-center md:items-start bg-navyBlue-200 md:bg-transparent md:border md:border-slate-200 px-6 md:rounded-xl md:w-[80%] gap-9 fixed bottom-14 py-3 inset-x-0 md:static'>
                  <div className='w-full flex items-center justify-around text-white md:text-slate-900 md:justify-start md:gap-3'>
                    <span>قیمت:</span>
                    <span className='text-nowrap font-semibold text-green-600'>{Number(product.price.toFixed(0)).toLocaleString('en-IR')} تومان</span>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <button type="button" onClick={()=>addToCart(product)} className={`text-nowrap rounded-lg px-6 py-2 cursor-pointer text-navyBlue-100 md:text-custom-silver font-semibold transition-all duration-200 ease-in ${product.stock > 0 ? "bg-custom-silver md:bg-navyBlue-100 hover:md:bg-navyBlue-200  hover:bg-gray-300" : "bg-navyBlue-100/50"}`} disabled={product.stock === 0}>{product.stock > 0 ? "افزودن به سبد" : "ناموجود"}</button>
                    <span className='text-nowrap text-custom-silver md:text-green-600 text-sm font-semibold md:text-base'>{product.stock} عدد در انبار</span>
                  </div>
                  
                </div>
          </div>
        </div>

        <div id='description' className='container my-9  text-white font-mono'>
          <h2 className='text-navyBlue-100 font-bold text-xl mb-6 pr-3'>درباره محصول</h2>
          <p className='bg-navyBlue-100 rounded-lg py-2 px-6'>{product.description}</p>
        </div>
    </>
    )}
        
    </div>

    <div className='  '>
          <div className='bg-[#f0eff1]'><ContactUs/></div>
          <div className='bg-navyBlue-200 px-6 py-4' ><Footer/></div>
        </div>
    </>
  )
  
}

export default ProductDetails
