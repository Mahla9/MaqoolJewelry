import React from 'react';
import useForgotPassStore from '../../store/useForgotPassStore';
import { useSetPassword } from '../../api/reset-forgotPass';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';

const schema = yup.object().shape({
  newPassword: yup.string().required().min(6, 'پسورد حداقل 6 رقم باشد').matches(),
  confirmNewPassword: yup.string().oneOf([yup.ref("newPassword")], 'تایید پسورد با پسورد تطابق ندارد')
})

function SetNewPassword() {
  const email = useForgotPassStore(state=>state.email);
  const code = useForgotPassStore(state=>state.code);
  const resetForgotPassword = useForgotPassStore(state=>state.resetForgotPassword);
  const navigate = useNavigate();
  
  const setNewPass = useSetPassword();
  const { register, handleSubmit, formState:{errors} } = useForm({resolver: yupResolver(schema)})

  const onSubmit = async (data) => {
    const allData = { ...data, email, code };
    try {
      const res = await setNewPass.mutateAsync(allData);
      resetForgotPassword();
      toast.success(res.data?.message);
      navigate('/auth');
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <>
    <div className='bg-navyBlue-200 pb-9'><Header/></div>
    <form dir='rtl' onSubmit={handleSubmit(onSubmit)} className='container h-[80vh] flex flex-col gap-3 items-center justify-center'>
      <div className='w-full md:w-[60%] flex flex-col gap-2'>
        <label htmlFor="newPassword">پسورد جدید</label>
        <input type="password" id="newPassword" {...register('newPassword')} className=' border border-slate-400 h-10 rounded-full px-6'/>
        {errors.newPassword && <p className='text-red-400 text-xs font-semibold'>{errors.newPassword.message}</p>}
      </div>

      <div className='w-full md:w-[60%] flex flex-col gap-2'>
        <label htmlFor="confirmNewPassword">تایید پسورد جدید</label>
        <input type="password" id="confirmNewPassword" {...register('confirmNewPassword')} className=' border border-slate-400 h-10 rounded-full px-6'/>
        {errors.confirmNewPassword && <p className='text-red-400 text-xs font-semibold'>{errors.confirmNewPassword.message}</p>}
      </div>

      <button type="submit" className='bg-navyBlue-100 text-white rounded-full px-4 py-2 cursor-pointer'>تغییر پسورد</button>
    </form>
    </>
  )
}

export default SetNewPassword
