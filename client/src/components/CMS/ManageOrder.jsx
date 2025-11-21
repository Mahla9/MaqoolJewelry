import React, { useState } from 'react';
import { useGetAllOrders, useUpdateOrder } from '../../api/fetchOrder';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import OrderDetailsModal from './OrderDetailsModal';
import OrderItem from './OrderItem';

function ManageOrder() {
  const [selectedOrder, setSelectedOrder] = useState(null); // for show status details
  const {data, isLoading, isError} = useGetAllOrders();
  const status = ["درحال بررسی", "آماده سازی", "ارسال شد", "دریافت شد", "کنسل شد"];
  const updateStatus = useUpdateOrder();
  const queryClient = useQueryClient();

  // useEffect(()=>{
  //   console.log(data)
  // },[data])

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
        <OrderItem 
          key={order._id}
          order={order}
          setSelectedOrder={setSelectedOrder}
          handleStatusChange={handleStatusChange}
          status={status}
        />
      ))}
            {selectedOrder && (
              <OrderDetailsModal 
              order={selectedOrder} 
              onClose={setSelectedOrder} 
              />
            )}
      
    </div>
  )
}

export default ManageOrder
