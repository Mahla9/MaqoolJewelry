import React from 'react';
import { Heart, User, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import axios from '../../lib/axios';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';


function NavIcon() {
  const cart = useCartStore(state=>state.cart)
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      const res = await axios.get('/user/profile');
      return res.data.user;
    },
    enabled: !!user, // فقط اگر کاربر لاگین است
    staleTime: 1000 * 60 * 10, // 10 دقیقه کش
    retry: false,
  });

  const handleUser = () => {
    if (!profile) navigate('/auth');
    else if (profile.role === 'admin') navigate('/admin/cms');
    else navigate('/dashboard');
  }
  return (
    <div className='flex justify-around md:gap-3 items-center md:justify-center'>
        <Heart className='size-10 md:size-7 stroke-1 transition-all duration-200 ease-in cursor-pointer hover:text-slate-500'/>
        <User onClick={handleUser} className='size-10 md:size-7 stroke-1 transition-all duration-200 ease-in cursor-pointer hover:text-slate-500'/>
        <div className='relative group/cart' onClick={()=>navigate('/cart')}>
            <ShoppingCart className='size-10 md:size-7 stroke-1 transition-all duration-200 ease-in cursor-pointer group-hover/cart:text-slate-500'/>
            <span className='bg-lavender-400 h-4 leading-4 text-center text-xs text-white w-4 rounded-full  transition-all duration-200 ease-in group-hover/cart:bg-lavender-300 absolute -top-1 -right-1'> {cart.length} </span>
        </div>
    </div>
  );
};

export default NavIcon;