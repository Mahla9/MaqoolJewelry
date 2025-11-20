import React from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { User2, ShoppingCart, MapPin, Heart, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLogout } from '../../api/useAuth';
import { useQueryClient } from '@tanstack/react-query';

function UserDashboardTab() {
  const logout = useAuthStore(state=>state.logout);
  const navigate = useNavigate();
  const LogoutFromServer = useLogout();
  const queryClient = useQueryClient();
  const {content} = useParams();

  const handleLogOut = async () => {
  try {
    queryClient.removeQueries(['profile']);
    await LogoutFromServer.mutateAsync();
    logout(); // پاک کردن استور کلاینت
    navigate('/');
    toast.success("خروج با موفقیت انجام شد");
  } catch (error) {
    toast.error(error?.message);
  }
};
  return (
    <div className=' w-full bg-custom-silver/50 md:w-auto border border-slate-300 rounded-md'>
      <ul className='flex h-full flex-col items-start px-3 justify-around gap-6 py-6'>
        <NavLink to="/dashboard/profile" className={`flex gap-3 items-center ${content === 'profile' ? "active-tab" : ""}`}>
          <User2 /> 
          <span>پروفایل</span>
        </NavLink>
        
        <NavLink to="/dashboard/user-orders" className={`flex gap-3 items-center ${content === 'user-orders' ? "active-tab" : ""}`}>
          <ShoppingCart /> 
          <span>سفارشات</span>
        </NavLink>
        
        <NavLink to="/dashboard/user-shipping" className={`flex gap-3 items-center ${content === 'user-shipping' ? "active-tab" : ""}`}>
          <MapPin />
          <span> آدرس ها</span>
        </NavLink>
        
        <NavLink to="/dashboard/wishlist" className={`flex gap-3 items-center text-nowrap ${content === 'wishlist' ? "active-tab" : ""}`}>
          <Heart />
          <span>  علاقه مندی ها</span>
        </NavLink>
        
        <NavLink to="/dashboard/logout" className='flex gap-3 items-center' onClick={handleLogOut}>
          <LogOut /> 
          <span>خروج</span>
        </NavLink>
      </ul>
    </div>
  )
}

export default UserDashboardTab
