import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddShippingAddress } from '../../api/fetchShipping';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const persianRegex = /^[\u0600-\u06FF\s]+$/;
const phoneRegex = /^9\d{9}$/;
const emailRegex = /^[\w.-]+@gmail\.com$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
const addressRegex = /^[\u0600-\u06FF0-9\s/.,\-()]+$/;

const schema = yup.object().shape({
  firstname: yup.string().required('نام الزامی است').matches(persianRegex, 'نام باید فارسی باشد'),
  lastname: yup.string().required('نام خانوادگی الزامی است').matches(persianRegex, 'نام خانوادگی باید فارسی باشد'),
  address: yup.string().required('آدرس الزامی است').matches(addressRegex, 'آدرس باید فارسی باشد و می‌تواند شامل اعداد، اسلش، و کاراکترهای مجاز باشد'),
  province: yup.string().required('استان الزامی است').matches(persianRegex, 'استان باید فارسی باشد'),
  city: yup.string().required('شهر الزامی است').matches(persianRegex, 'شهر باید فارسی باشد'),
  postalCode: yup.string().required('کد پستی الزامی است'),
  phone: yup.string().required('شماره تلفن الزامی است').matches(phoneRegex, 'شماره باید با 9 شروع شود و 10 رقم باشد'),
  email: yup.string().required('ایمیل الزامی است').matches(emailRegex, 'ایمیل باید با @gmail.com تمام شود'),
  password: yup.string().required('رمز عبور الزامی است').matches(passwordRegex, 'رمز عبور باید حداقل 6 کاراکتر، شامل حروف بزرگ، کوچک، عدد و یک علامت باشد'),
});

function ShippingForm() {
    
    const queryClient = useQueryClient();
    const addShipping = useAddShippingAddress();
    const { register, handleSubmit, formState:{errors}, reset } = useForm({ 
      resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
      addShipping.mutate(data, {
        onSuccess: () => {
          queryClient.invalidateQueries('shippingAddresses');
          toast.success('آدرس جدید با موفقیت به لیست آدرس های حمل و نقل اضافه شد');
          reset();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'خطا در ثبت آدرس');
        }
      });
    }


  return (
    <form action="" className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-3'>
            <label htmlFor="firstname">نام</label>
            <input {...register('firstname')} type="text" id='firstname' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.firstname && <p className='text-red-400 text-xs font-semibold'>{errors.firstname.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="lastname">نام خانوادگی</label>
            <input {...register('lastname')} type="text" id='lastname' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.lastname && <p className='text-red-400 text-xs font-semibold'>{errors.lastname.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="address">آدرس</label>
            <input {...register('address')} type="text" id='address' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.address && <p className='text-red-400 text-xs font-semibold'>{errors.address.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="province">استان</label>
            <input {...register('province')} type="text" id='province' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.province && <p className='text-red-400 text-xs font-semibold'>{errors.province.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="city">شهر</label>
            <input {...register('city')} type="text" id='city' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.city && <p className='text-red-400 text-xs font-semibold'>{errors.city.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="postalCode">کد پستی</label>
            <input {...register('postalCode')} type="text" id='postalCode' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.postalCode && <p className='text-red-400 text-xs font-semibold'>{errors.postalCode.message}</p>}
          </div>
          <div className='flex flex-col gap-3'>
            <label htmlFor="phone">شماره تلفن</label>
            <input {...register('phone')} type="text" id='phone' className='border border-gray-300 p-2 rounded-xl'/>
            {errors.phone && <p className='text-red-400 text-xs font-semibold'>{errors.phone.message}</p>}
          </div>
          <button type="submit" className='bg-indigo-500 px-4 py-2 rounded-xl text-white cursor-pointer'>ذخیره</button>
        </form>
  )
}

export default ShippingForm;