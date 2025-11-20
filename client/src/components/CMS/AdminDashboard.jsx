import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import { ListOrdered, UserRoundSearch, PlusCircle, ListCheckIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom';
// import useGetAdminInfo from '../../api/useGetAdminInfo';

// اون ادمینی ک لاگ شده رو بالا بیار، باید سمت احراز هویت رو چک بزنی از اونجا اطلاعاتو ب اینجا ارسال کنی

function AdminDashboard() {
  // const {data:admin, isLoading, isError} = useGetAdminInfo()
  const user = useAuthStore(state=>state.user)
  return (
    <div className=' flex flex-col gap-9' dir='rtl'>
      <div className='flex justify-between items-center border-b border-slate-300 pb-6 text-xs font-semibold md:text-sm lg:text-base'>
        <h2>داشبورد مدیر</h2>
        <span> خوش آمدید، {user.username} </span>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-center sm:text-nowrap'>

        <NavLink to="/admin/cms/add-product" className='flex gap-3 flex-col md:flex-row items-center rounded-2xl justify-center border  text-xs md:text-sm lg:text-base font-semibold lg:font-normal border-slate-500 p-6 sm:px-6 sm:py-2 sm:h-36 lg:h-44 xl:h-48 transition-all duration-150 ease-in hover:bg-custom-silver/60 active:bg-custom-silver/60'>
            <PlusCircle/>
            <span>افزودن محصول</span>
        </NavLink>
        
        <NavLink to="/admin/cms/manage-orders" className='flex gap-3 flex-col md:flex-row items-center rounded-2xl justify-center border  text-xs md:text-sm lg:text-base font-semibold lg:font-normal border-slate-500 p-6 sm:px-6 sm:py-2 sm:h-36 lg:h-44 xl:h-48 transition-all duration-150 ease-in hover:bg-custom-silver/60 active:bg-custom-silver/60'>
          <ListOrdered/>
          <span>مدیریت سفارشات</span>
        </NavLink>
        
        <NavLink to="/admin/cms/user-list" className='flex gap-3 flex-col md:flex-row items-center rounded-2xl justify-center border  text-xs md:text-sm lg:text-base font-semibold lg:font-normal border-slate-500 p-6 sm:px-6 sm:py-2 sm:h-36 lg:h-44 xl:h-48 transition-all duration-150 ease-in hover:bg-custom-silver/60 active:bg-custom-silver/60'>
          <UserRoundSearch/>
          <span>لیست کاربران</span>
        </NavLink>
        
        <NavLink to="/admin/cms/product-list" className='flex gap-3 flex-col md:flex-row items-center rounded-2xl justify-center border  text-xs md:text-sm lg:text-base font-semibold lg:font-normal border-slate-500 p-6 sm:px-6 sm:py-2 sm:h-36 lg:h-44 xl:h-48 transition-all duration-150 ease-in hover:bg-custom-silver/60 active:bg-custom-silver/60'>
          <ListCheckIcon/>
          <span>مدیریت محصولات</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminDashboard;