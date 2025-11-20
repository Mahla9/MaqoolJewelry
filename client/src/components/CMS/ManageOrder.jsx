import React, { useEffect, useState } from 'react';
import { useGetAllOrders, useUpdateOrder } from '../../api/fetchOrder';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

function ManageOrder() {
  const [showModal, setShowModal] = useState(false); // for show status details
  const {data, isLoading, isError} = useGetAllOrders();
  const status = ["درحال بررسی", "آماده سازی", "ارسال شد", "دریافت شد", "کنسل شد"];
  const updateStatus = useUpdateOrder();
  const queryClient = useQueryClient();

  useEffect(()=>{
    console.log(data)
  },[data])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast.success(res.data.message);
      queryClient.invalidateQueries(['allOrders']);
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }



  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading orders</div>;

  return (
    <div className='' dir='rtl'>
      <h2 className='text-navyBlue-100 font-black text-2xl border-b border-slate-300 pb-6 mb-6'>مدیریت سفارشات کاربران</h2>
      {data?.orders?.length > 0 && data.orders.map(order => (
        <div key={order._id} className='flex justify-between items-center rounded-xl p-3 border mb-3 gap-3'>
          <div className='flex flex-col gap-3'>
            <h3 className='text-xs font-semibold text-slate-400'>سفارش از : {order.shippingAddress?.province} - {order.shippingAddress?.city}</h3>
            <p className='text-xs font-semibold'>مجموع قیمت: {(order.totalPrice).toLocaleString('en-IR')} تومان</p>
            <button type='button' className='bg-green-500 rounded-xl h-10 px-3 md:px-6 text-white text-xs font-semibold transition-all ease-in duration-200 hover:bg-green-500/80 cursor-pointer' onClick={()=>setShowModal(true)}>جزئیات</button>
          </div>

          <div className=' flex flex-col gap-3'>
            <div>
              <span className='text-xs'>وضعیت:</span>
              <span className='text-green-500 text-xs font-semibold'>{order.status}</span>
            </div>
            <select name="orderStatus" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className='focus:outline-none border py-2 border-slate-400 rounded-sm text-xs font-semibold'>
            {status.map((stat, index) => (
              <option key={index} value={stat}>
                {stat}
              </option>
            ))}
            </select>

          </div>

            {showModal && (
              <>
              {/* overlay */}
              <div className='fixed inset-0 bg-navyBlue-100/30' onClick={()=>setShowModal(false)}></div>

              <div className='fixed left-1/2 top-1/2 -translate-1/2 flex flex-col gap-6 justify-center items-center bg-white p-3 rounded-xl'>
                  <h4 className='text-navyBlue-100 font-bold text-lg'>جزئیات سفارش</h4>
                  <p>شماره سفارش: {order._id}</p>
                  <span>نام و نام خانوادگی گیرنده: {order.shippingAddress?.firstname} {order.shippingAddress?.lastname}</span>
                  <p>آدرس ارسال: {order.shippingAddress?.province} - {order.shippingAddress?.city} - {order.shippingAddress?.address}</p>
                  <span>کدپستی: {order.shippingAddress?.postalCode}</span>
                  <span>شماره تماس: {order.shippingAddress?.phone}</span>
                  <h5 className='font-semibold'>محصولات:</h5>
                  <ul>
                    {order?.products?.map(item => (
                      <li key={item._id}>
                        {item.title} - {item.quantity} عدد
                      </li>
                    ))}
                  </ul>
              </div>
              </>
            )}

        </div>
      ))}

      
    </div>
  )
}

export default ManageOrder
