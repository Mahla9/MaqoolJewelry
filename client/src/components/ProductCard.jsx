import  { memo } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

function ProductCard({product}) {
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div className='rounded-xl overflow-hidden shadow-md shadow-gray-600 backdrop-blur-3xl flex flex-col justify-between'>
        <div className='w-60'>
          <img onClick={() => navigate(`/products/${product._id}`)} src={`/${product.image.replace(/\\/g, '/')}`} alt="ring" className='w-full h-full object-contain cursor-pointer'/>
        </div>
        <div className='bg-navyBlue-200 flex flex-col gap-3 py-4 px-6'>
          <h3 onClick={() => navigate(`/products/${product._id}`)} className='text-white self-end cursor-pointer'>{product.title}</h3>
        <span className='text-white text-xs self-end'>قیمت : {Number(product.price.toFixed(0)).toLocaleString('en-IR')} تومان</span>
        <div className='w-full flex justify-between items-center'>
            <Heart className='size-6 text-white cursor-pointer transition-all ease-in duration-200 hover:text-red-700'/>
            <button type="button" onClick={() => addToCart(product)} className='bg-white/70 transition-all ease-in duration-200 hover:bg-white rounded-full cursor-pointer px-4 py-1 text-navyBlue-100 hover:font-semibold text-xs'>افزودن به سبد خرید</button>
        </div>
        </div>
    </div>
  )
}

export default memo(ProductCard);