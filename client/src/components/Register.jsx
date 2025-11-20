import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../api/useAuth';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuthStore from '../store/useAuthStore';


const schema = yup.object().shape({
    username: yup.string().required('نام کاربری اجباری است').min(4, 'نام کاربری حداقل 4 حرف باشد'),
    email: yup.string().required('ایمیل اجباری است').test(
        '',
        'دامنه ایمیل معتبر نیست',
        (value) => value && value.endsWith('@gmail.com')
    ),
    password: yup.string().required().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد"
    ),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'رمزعبور باید مطابقت داشته باشد').required()
})

function Register() {
    const navigate = useNavigate();
    const register = useRegister();
    const setEmail = useAuthStore((state) => state.setEmail);
    const { register:registerform, handleSubmit, formState: {errors} } = useForm({resolver: yupResolver(schema)});

    const onSubmit = async (user) => {

        try {
            const res = await register.mutateAsync(user);
            const { message } = res.data;
            setEmail(user.email);
            navigate('/register/verify');
            toast.success(message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در ثبت نام';
            toast.error(errorMessage);
            console.error('خطا در ثبت نام:', errorMessage);
        }
    }
  return (
    <form className='flex justify-between flex-col gap-y-2 md:gap-y-3.5' onSubmit={handleSubmit(onSubmit)} dir='rtl'>
        <div className='flex flex-col'>
            <label htmlFor="username0" className='text-navyBlue-100 text-xs mb-1 md:text-base font-semibold pr-2'>نام کاربری:</label>
            <input {...registerform('username')} className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5' type="text" id='username0'/>
            {errors.username && <p className='text-red-400 text-xs font-semibold'>{errors.username.message}</p>}
        </div>

        <div className='flex flex-col'>
            <label htmlFor="email0" className='text-navyBlue-100 text-xs mb-1 md:text-base font-semibold pr-2'>ایمیل:</label>
            <input {...registerform('email')} className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5' type="text" id='email0'/>
            {errors.email && <p className='text-red-400 text-xs font-semibold'>{errors.email.message}</p>}
        </div>

        <div className='flex flex-col'>
            <label htmlFor="password0" className='text-navyBlue-100 text-xs mb-1 md:text-base font-semibold pr-2'>پسورد:</label>
            <input {...registerform('password')} className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5' type="password" id='password0'/>
            {errors.password && <p className='text-red-400 text-xs font-semibold'>{errors.password.message}</p>}
        </div>

        <div className='flex flex-col'>
            <label htmlFor="confirmPassword0" className='text-navyBlue-100 text-xs mb-1 md:text-base font-semibold pr-2'>تأیید پسورد:</label>
            <input {...registerform('confirmPassword')} className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5' type="password" id='confirmPassword0'/>
            {errors.confirmPassword && <p className='text-red-400 text-xs font-semibold'>{errors.confirmPassword.message}</p>}
        </div>

        <div className='w-full'>
            <button type="submit" className={`border-none cursor-pointer ${register.isPending ? "bg-navyBlue-100/50" : "bg-navyBlue-200"} text-white h-10 rounded-full text-center w-full mt-3 duration-200 ease-in transition-all hover:bg-navyBlue-100`} disabled= {register.isPending}>
                {register.isPending && (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {register.isPending ? "در حال ارسال داده ..." : "ثبت نام"}
            </button>
        </div>
        {register.isError && (
            <p className='text-red-400 text-xs font-semibold'>{register.error.message}</p>
        )}

    </form>
  )
}

export default Register;
