import React from 'react';
import CalculatePrices from '../components/CalculatePrices';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderById } from '../api/fetchOrder';
import Header from '../components/Header/Header';
import ContactUs from '../components/Main/ContactUsFooter';
import Footer from '../components/Footer/Footer';

function Payment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { data: order, isPending, isError } = useGetOrderById(orderId);

    const handlePayment = () => {
        // اینجا باید متصل بشه به درگاه پرداخت ولی فعلا موقتی متصل میکنیم به صفحه وضعیت سفارش
        navigate(`/cart/order-success/${orderId}`);
    };

    if (isPending) return <div dir='rtl' className='h-screen flex items-center gap-3 justify-center'>
      در حال بارگذاری...
      <span className='animate-spin border-4 border-navyBlue-100 border-t-transparent rounded-full w-6 h-6'></span>
      
    </div>;
    if (isError || !order) return <div dir='rtl' className='h-screen flex items-center gap-3 justify-center text-red-400'>خطا در دریافت اطلاعات سفارش</div>;

    return (
    <div>
      <div className='bg-navyBlue-200 pb-9'><Header/></div>
        <h1 className='font-bold text-navyBlue-100 text-2xl text-center my-9'>صفحه پرداخت نهایی</h1>
        <div className='container w-[60%]' dir='rtl'>
          <CalculatePrices/>
          <span className='flex items-center gap-6'>
            <div>
              <span>درگاه پرداخت: زرین پال</span>
              {/* <img src="" alt="zarinPal" /> */}
            </div>
            <button type='button' className='bg-green-600 px-6 py-2 rounded-md my-6 text-white cursor-pointer transition-all ease-in duration-200 hover:bg-emerald-600' onClick={handlePayment} >پرداخت</button>
          </span>
        </div>
      <div><ContactUs/></div>
      <Footer/>
    </div>
  )
}

export default Payment
