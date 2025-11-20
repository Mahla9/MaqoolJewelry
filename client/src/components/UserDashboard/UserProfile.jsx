import React from 'react';
import useAuthStore from '../../store/useAuthStore';

function UserProfile() {
  const user = useAuthStore(state=>state.user)

    const handleResetPass = () => {
    // باید توی بک اند براش ایجاد کنم کنترلر و روت جدید
  }
  return (
    <div dir='rtl' className='container flex flex-col gap-6'>
          <div className='flex justify-between pb-9 mb-6 border-b border-slate-400'>
            <h2>داشبورد</h2>
            <p>خوش آمدید , {user.username}</p>
          </div>

          <div className='flex flex-col gap-9'>
              <h3>اطلاعات حساب کاربری</h3>
              <p>نام کاربری: {user.username}</p>
              <p>ایمیل: {user.email}</p>


              <form onSubmit={handleResetPass} className='flex flex-col gap-6 w-full md:w-2/3 lg:w-1/2 mt-6'>
                <h2 className='text-lg font-semibold text-navyBlue-100'>تغییر پسورد</h2>
                <div className='flex flex-col'>
                  <label htmlFor="new-password">رمز عبور جدید</label>
                  <input type="password" id="new-password" className='border h-10 rounded-full px-3' placeholder='پسورد جدید'/>
                </div>
                <div className='flex flex-col'>
                  <label htmlFor="confirm-new-password">تایید رمز عبور جدید</label>
                  <input type="password" id="confirm-new-password" className='border h-10 rounded-full px-3' placeholder='تایید پسورد جدید'/>
                </div>

                <button type="submit" className='bg-indigo-500 px-6 py-2 cursor-pointer rounded-xl text-white'>تغییر رمز عبور</button>
              </form>
          </div>
        </div>
  )
}

export default UserProfile
