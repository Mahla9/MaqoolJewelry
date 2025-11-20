import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../api/useAuth';
import useAuthStore from '../store/useAuthStore';
import {toast} from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
    username: yup.string().required("نام کاربری الزامی است"),
    password: yup.string().required("رمز عبور الزامی است")
});

function Login() {
    const navigate = useNavigate();
    const postUser = useLogin();
    const login = useAuthStore(state=>state.login);
    const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)});

    const onSubmit = async (values) => {
        try {
            const res = await postUser.mutateAsync(values);
            const {user: userData, token, redirect, message} = res.data;

            // ذخیره اطلاعات کاربر و توکن
            login(userData, token);

            // نمایش پیام موفقیت و هدایت کاربر
            toast.success(message);
            navigate(redirect);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در ارتباط با سرور';
            toast.error(errorMessage);
            console.error( errorMessage);
        }
    }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} dir='rtl' className='flex flex-col gap-3 md:gap-6'>
        <div className='flex flex-col'>
            <label htmlFor="username" className='text-xs font-semibold md:text-base text-navyBlue-100 pr-2 pb-1'>نام کاربری:</label>
            <input {...register('username')} type="text" id='username' className='border border-navyBlue-100 rounded-full h-8 md:h-10 px-3 md:px-8 focus:outline-none' />
            {errors.username && <p className='text-red-400 text-xs font-sans'>{errors.username.message}</p>}
        </div>
        <div className='flex flex-col'>
            <label htmlFor="password" className='text-xs font-semibold md:text-base text-navyBlue-100 pr-2 pb-1'>پسورد:</label>
            <input {...register('password')} type="password" id='password' className='border border-navyBlue-100 rounded-full h-8 md:h-10 px-3 md:px-8 focus:outline-none' />
            {errors.password && <p className='text-red-400 text-xs font-sans'>{errors.password.message}</p>}
        </div>
        <button className={`rounded-full mt-2 h-10 text-white cursor-pointer bg-gradient-to-r  transition-all duration-200 ease-in hover:bg-gradient-to-l ${postUser.isPending? "from-navyBlue-100/50 to-navyBlue-200/50" : "from-navyBlue-100 to-navyBlue-200"}`} type='submit' disabled= {postUser.isPending}>
            {postUser.isPending && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {postUser.isPending ? "در حال ورود..." : "ورود"}
        </button>
    </form>

    <Link to={'/forgot-password'} className='text-xs font-semibold text-navyBlue-100 mt-2'>فراموشی رمز عبور؟</Link>
    </>
  )
}

export default Login;