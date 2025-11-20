import React, { useEffect } from 'react'
import { useGetUserOrders } from '../../api/fetchOrder';

function UserOrders() {
  const {data, isLoading,isError} = useGetUserOrders();

  useEffect(()=>{
    console.log(data)
  },[data]);

  return (
    <div className='flex flex-col gap-6'>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching orders</p>}
      <h2 className='text-xl font-semibold text-navyBlue-100 pb-3'>سفارشات من</h2>
      {data?.length>0 ? (
        <div className='flex flex-col gap-3'>
          {data?.map(order=>(
            <ul key={order._id} className='border-t border-slate-400 py-6'>
                <li>
                  تاریخ خرید :
                   {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </li>
                <li>
                  شماره سفارش: 
                   {order._id}
                </li>
                <li>
                  وضعیت سفارش:
                  <b className='text-green-700'>{order.status}</b>
                </li>
            </ul>
          ))}
        </div>
      ) : (
        <div >
          هیچ سفارشی ثبت نشده است
        </div>
      )}
    </div>
  )
}

export default UserOrders;