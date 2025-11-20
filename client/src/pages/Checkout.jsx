import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ContactUs from '../components/Main/ContactUsFooter';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetShippingAddresses, useAddShippingAddress } from '../api/fetchShipping';
import { toast } from 'react-toastify';
import { useCreateOrder } from '../api/fetchOrder';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import CalculatePrices from '../components/CalculatePrices';
import { useShallow } from 'zustand/shallow';

const schema = yup.object().shape({
  firstname: yup.string().required('نام الزامی است'),
  lastname: yup.string().required('نام خانوادگی الزامی است'),
  province: yup.string().required('استان الزامی است'),
  city: yup.string().required('شهر الزامی است'),
  address: yup.string().required('آدرس الزامی است'),
  postalCode: yup.string().required('کد پستی الزامی است'),
  phone: yup.string().required('شماره تلفن الزامی است').matches(/^9\d{9}$/, 'شماره تلفن باید ۱۰ رقم و با ۹ شروع شود'),
});

function Checkout() {
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const addShipping = useAddShippingAddress();
  const { data: shippingAddresses = [], isLoading, error, refetch } = useGetShippingAddresses();
  const createOrder = useCreateOrder();
  

  const { cart, calculatePrices, totalPrice, setOrderSuccess } = useCartStore(
    useShallow((state) => ({
      cart: state.cart,
      calculatePrices: state.calculatePrices,
      totalPrice: state.totalPrice,
      setOrderSuccess: state.setOrderSuccess,
    }))
  );

  const navigate = useNavigate();


  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // محاسبه محصولات و قیمت کل
  const products = cart.map(item => ({
    product: item.product._id,
    quantity: item.quantity
  }));
  
  useEffect(()=>{
    console.log(products);
    console.log(shippingAddresses);
    console.log(cart);
    console.log(selectedAddressId);
  }, [products, shippingAddresses, cart, selectedAddressId]);

  // ثبت سفارش با آدرس انتخابی
  const handleOrder = async (addressId) => {
    try {
      await calculatePrices();
      const res = await createOrder.mutateAsync({
        shippingAddress: addressId,
        products,
        totalPrice
      });
      setOrderSuccess(res.data); // اطلاعات سفارش موفق
      navigate(`/cart/checkout/payment/${res.data._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'خطا در ثبت سفارش');
      console.error(error)
    }
  };

  // ثبت آدرس جدید و سپس ثبت سفارش
  const onSubmit = (data) => {
    addShipping.mutate(data, {
      onSuccess: (res) => {
        toast.success('آدرس جدید با موفقیت ثبت شد');
        refetch(); // آدرس‌ها را مجدد بگیر
        handleOrder(res.data._id);
        reset();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'خطا در ثبت آدرس');
      }
    });
  };



  return (
    <div className=''>
      <div className='bg-navyBlue-200 pb-9'><Header /></div>
      <div className='container my-6'>
        <div className='flex flex-col gap-6 md:flex-row-reverse'>
          <div dir='rtl' className="p-4 w-full md:w-2/3">
            {isLoading && 
            <div className='flex gap-3'>
              <span className='animate-spin border-4 border-t-transparent border-navyBlue-100 rounded-full w-6 h-6'></span>
              در حال دریافت آدرس‌ها...
            </div>}
            {error && <div className="text-red-500">{error.message}</div>}
            {/* نمایش آدرس‌های ذخیره شده */}
            {shippingAddresses?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">آدرس‌های ذخیره شده</h3>
                <p className='text-gray-600 font-semibold text-xs my-3'>اگر میخواهید به آدرس زیر ارسال شود لطفا ابتدا آدرس را انتخاب کنید و سپس دکمه ثبت سفارش را بزنید😊</p>
                <ul className="space-y-2">
                  {shippingAddresses.map(address => (
                    <li key={address._id}>
                      <input type='radio'
                        className={`border p-2 rounded cursor-pointer ${selectedAddressId === address._id ? 'bg-blue-100' : ''}`}
                        onClick={() => setSelectedAddressId(address._id)}
                      />
                      {address.firstname} {address.lastname} - {address.address}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* فرم ثبت آدرس جدید */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold mb-6 text-xl text-navyBlue-100">ثبت آدرس جدید</h3>
              <form id='new-address-form' onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="firstname">نام</label>
                  <input type="text" id="firstname" {...register('firstname')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="lastname">نام خانوادگی</label>
                  <input type="text" id="lastname" {...register('lastname')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="province">استان</label>
                  <input type="text" id="province" {...register('province')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.province && <p className="text-red-500">{errors.province.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="city">شهر</label>
                  <input type="text" id="city" {...register('city')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="address">آدرس دقیق (خیابان، پلاک، واحد ...)</label>
                  <input type="text" id="address" {...register('address')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="postalCode">کد پستی</label>
                  <input type="text" id="postalCode" {...register('postalCode')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.postalCode && <p className="text-red-500">{errors.postalCode.message}</p>}
                </div>
                <div className='flex flex-col gap-3'>
                  <label className='pr-2 text-slate-600' htmlFor="phone">شماره تلفن</label>
                  <input type="text" id="phone" {...register('phone')} className="border rounded-xl border-custom-silver h-10 px-3" />
                  {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                </div>
              </form>
            </div>
          </div>
          <div className='w-full md:w-1/3 md:pl-4 md:sticky md:top-8 h-fit'>
            <CalculatePrices/>
            <button
              className="mt-4 px-4 py-2 transition-all duration-200 ease-in bg-navyBlue-100 hover:bg-navyBlue-100/80 text-white rounded-md cursor-pointer w-full"
              disabled={(!selectedAddressId && addShipping.isPending) || createOrder.isLoading}
              onClick={async (e) => {
                e.preventDefault();
                if (selectedAddressId) {
                  await handleOrder(selectedAddressId);
                } else {
                  handleSubmit(onSubmit)();
                }
              }}
            >
              {selectedAddressId ? 'ثبت سفارش با این آدرس' : 'ثبت آدرس جدید و ثبت سفارش'}
            </button>
          </div>
        </div>

      </div>
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Checkout;