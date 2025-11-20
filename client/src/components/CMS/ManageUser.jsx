import React, { useEffect } from 'react';
import useGetUsers from '../../api/useGetUsers';

function ManageUser() {
  const { data, isLoading, isError } = useGetUsers();

  useEffect(()=>{
    console.log(data)
  },[data])
  return (
    <div className='' >
      <h2 className='text-navyBlue-100 font-black text-2xl border-b border-slate-300 pb-6 mb-6'>لیست کاربران سایت</h2>
      <table className='divide-y divide-slate-300'>
        <thead>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase'>نام</th>
            <th className='px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase'>ایمیل</th>
            <th className='px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase'>عملیات</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-300'>
          {/* Map through users and display them */}
          {data?.users?.map(user => (
            <tr key={user.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700'>{user.username}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-500'>{user.email}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button className='text-red-500 hover:text-red-700'>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && 
        <div className='flex justify-center items-center gap-3'>
          <span className='animate-spin border-4 border-navyBlue-100 rounded-full h-6 w-6 border-t-transparent'></span>
          در حال بارگذاری ...
        </div>
      }
      {isError && <div className='text-red-500 flex justify-center items-center'> خطا در دریافت لیست کاربران</div>}
    </div>
  )
}

export default ManageUser
