import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ContactUs from '../components/Main/ContactUsFooter';
import { useGetOrderById } from '../api/fetchOrder';
import useAuthStore from '../store/useAuthStore';

function OrderSuccess() {
  const { orderId } = useParams();
  const clearCart = useCartStore(state=>state.clearCart);
  const { data: order, isPending, isError } = useGetOrderById(orderId);
  const user = useAuthStore(state=>state.user)

  useEffect(() => {
    if (order) clearCart();
  }, [order, clearCart]);

  if (isPending) return <div>در حال بارگذاری...</div>;
  if (isError || !order) return <div>خطا در دریافت اطلاعات سفارش</div>;

  return (
    <div>
      <div className='bg-navyBlue-200 pb-9'><Header /></div>
      <div dir='rtl' className="container p-4 text-center flex flex-col gap-6">
        <h2 className=' text-green-600 font-bold text-xl border border-dashed p-3 rounded-xl'>سفارش شما با موفقیت ثبت شد!</h2>
        <table className="border border-slate-300 rounded-xl p-3 w-fit mx-auto">
          <thead className='text-slate-600'>
            <tr>
              <th>َشناسه سفارش</th>
              <th>تاریخ سفارش</th>
              <th>ایمیل</th>
              <th>جمع کل</th>
            </tr>
          </thead>
          <tbody>
            <tr className='text-xs font-semibold text-slate-500'>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
              <td>{user.email}</td>
              <td>{order.totalPrice?.toLocaleString('en-IR')} تومان</td>
            </tr>
          </tbody>
        </table>
        <p className='text-xs font-semibold text-gray-800'>آدرس ارسال: {order.shippingAddress?.province} - {order.shippingAddress?.city} - {order.shippingAddress?.address}</p>
        <p className='text-xs font-semibold text-gray-800'>شماره تلفن ثبت شده: {order.shippingAddress?.phone}</p>
      </div>
      <ContactUs />
      <div className='bg-navyBlue-200 py-2'><Footer /></div>
    </div>
  );
}

export default OrderSuccess
