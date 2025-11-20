import React from 'react'
import { useDeleteShippingAddress, useGetShippingAddresses } from '../../api/fetchShipping'
import { Trash } from 'lucide-react';
import ShippingForm from './ShippingForm';
import { Spin } from 'antd';
import { useQueryClient } from '@tanstack/react-query'

function UserShipping() {
  const queryClient = useQueryClient();
  const {data, isLoading, isError} = useGetShippingAddresses();
  const deleteShippingAddress = useDeleteShippingAddress();

  const handleDelete = (addressId) => {
    deleteShippingAddress.mutate(addressId);
    queryClient.invalidateQueries('shippingAddresses');
  }

  return (
    <div>
        {data?.length>0 && data.map(address=>(
          <div key={address._id} className=' flex flex-col gap-3 border-b pb-6'>

            <div className='flex items-center transition-all duration-200 ease-in hover:text-red-400 cursor-pointer' onClick={() => handleDelete(address._id)}>
              <Trash />
              <span className='text-xs font-semibold'>حذف</span>
            </div>

            <p>{address.firstname} {address.lastname}</p>
            <p>استان: {address.province}</p>
            <p>شهر: {address.city}</p>
            <p>آدرس: {address.address}</p>
            <p>کد پستی: {address.postalCode}</p>
            <p>موبایل: {address.phone}</p>
          </div>
        ))
      }
      {data?.length===0 && <div className='my-6 border-b border-gray-200 pb-6'>
            آدرس ذخیره شده از قبل موجود نمی باشد
          </div>}
        {isLoading && <div>
            <span>در حال بارگذاری</span>
            <Spin size='9'/>
          </div>}

        {isError && <div>خطا در دریافت</div>}
        
          <div className='md:overflow-y-auto md:h-[60vh] mt-9'>
            <h2 className='text-xl text-navyBlue-100 font-semibold pb-3'>ثبت آدرس ارسال جدید</h2>
            <ShippingForm/>
          </div>
        
    </div>
  )
}

export default UserShipping;