import { useForgotPassword } from '../../api/reset-forgotPass';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router-dom'
import useForgotPassStore from '../../store/useForgotPassStore';
import Header from '../../components/Header/Header';


const schema = yup.object().shape({
  email: yup.string().email().required("ایمیل الزامی است").test(
    "is-valid-domain",
    "دامنه ایمیل معتبر نیست",
    (value) => value && value.endsWith("@gmail.com")
  ),
})
// مرحله یک: وارد کردن ایمیل و دکمه ارسال کد بازیابی
// مرحله دو: وارد کردن کد بازیابی و تایید اعتبار کد
// مرحله سه: وارد کردن رمز جدید و تایید رمز جدید و ارسال به سرور
function ForgotPassword() {
  const forgotPass = useForgotPassword();
  const navigate = useNavigate();
  const {register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)});
  const setEmail = useForgotPassStore(state => state.setEmail);

  const onSubmit = async (email) => {
    try {
      const res = await forgotPass.mutateAsync(email);
      const {message} = res.data;
      setEmail(email); // Persist email in store for next steps
      toast.success(message);
      navigate('/reset-password/verifycode');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'خطا در ارسال ایمیل');
    }
  };

  return (
    <>
    <div className='bg-navyBlue-200 pb-9'><Header/></div>
    <form dir='rtl' className='flex bg-custom-silver/40 items-center h-[80vh] justify-center gap-3 flex-col ' onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">رمز عبور خود را فراموش کردید؟</label>
      <input {...register('email')} type="text" placeholder='ایمیل خود را وارد کنید' className='rounded-full w-full md:w-[40%] h-10 px-3 border border-slate-400'/>
      <button type="submit" disabled={forgotPass.isPending} className={`cursor-pointer ${forgotPass.isPending ? "bg-navyBlue-100/50" : "bg-navyBlue-100"} text-white px-4 py-2 h-10 rounded-full transition-all ease-in duration-200 hover:bg-navyBlue-200`}>
        {forgotPass.isPending? " ...در حال ارسال" : "ارسال"}
        {forgotPass.isPending && (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
      </button>
    </form>
    {errors.email && <p className='text-red-400 text-xs font-sans'>{errors.email.message}</p>}
    </>
  )
}

export default ForgotPassword
