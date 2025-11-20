import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Home, ListChecks, ListOrdered, LogOut, PlusCircle, User2Icon, UserRoundCogIcon } from 'lucide-react';
import {useShallow} from 'zustand/shallow'
import { useLogout } from '../../api/useAuth';
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query';

function CmsTab() {
  const {content} = useParams();
  const navigate = useNavigate();
  const LogoutFromServer=useLogout();
  const {user, logout} = useAuthStore(useShallow(state=>({
    user: state.user,
    logout: state.logout,
  })));

  const queryClient = useQueryClient();

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
    <div dir='rtl' className='bg-white h-screen w-full md:w-auto flex flex-col p-6 rounded-xl'>
      <div className='self-center flex flex-col items-center gap-2.5 py-9 border-b border-slate-400'>
        <User2Icon className='stroke-slate-500 stroke-1 rounded-full size-8 bg-slate-200 w-16 h-16 p-3'/>
        <h2>{user.username}</h2>
        <span>{user.email}</span>
      </div>
      <ul className='flex h-full flex-col items-start px-3 justify-around '>
        <NavLink to="/admin/cms/dashboard" className={`${content==="dashboard" ? "active-tab" : ""} flex gap-3 items-center`}>
            <Home/>
            <span>داشبورد</span>
        </NavLink>
        <NavLink to="/admin/cms/add-product" className={`${content==="add-product" ? "active-tab" : ""} flex gap-3 items-center`}>
            <PlusCircle/>
            <span>افزودن محصول</span>
        </NavLink>
        <NavLink to="/admin/cms/manage-orders" className={`${content==="manage-orders" ? "active-tab" : ""} flex gap-3 items-center`}>
            <ListOrdered/>
            <span>مدیریت سفارشات</span>
        </NavLink>
        <NavLink to="/admin/cms/user-list" className={`${content==="user-list" ? "active-tab" : ""} flex gap-3 items-center`}>
            <UserRoundCogIcon/>
            <span>لیست کاربران</span>
        </NavLink>
        <NavLink to="/admin/cms/product-list" className={`${content==="product-list" ? "active-tab" : ""} flex gap-3 items-center`}>
            <ListChecks/>
            <span>لیست محصولات</span>
        </NavLink>
        <div className='flex gap-3 items-center cursor-pointer' onClick={handleLogOut}>
          <LogOut/>
          <span>خروج</span>
        </div>
      </ul>
    </div>
  )
}

export default CmsTab;