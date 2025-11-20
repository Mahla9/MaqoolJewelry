import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useVerify } from '../api/useAuth';

const VerifyForm = () => {

  const [code, setCode] = useState('');
  const email = useAuthStore(state => state.email);
  const login = useAuthStore(state => state.login);
  const verify = useVerify();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
  e.preventDefault();
  try {
    const res = await verify.mutateAsync({ email, code });
    const { user, token, message } = res.data;
    toast.success(message);
    login(user, token);
    navigate('/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'خطایی رخ داده است');
  }
};

  return (
    <form dir='rtl' onSubmit={handleVerify} className="flex flex-col gap-4 max-w-sm mx-auto h-screen items-center justify-center">
      <p className='text-slate-600'>لطفا کد تایید ارسال شده به ایمیل را وارد نمایید</p>
      <input
        type="text"
        placeholder="کد تأیید"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className='border border-slate-300 h-10 px-3 rounded-full w-full'
      />
      <button type="submit" className='bg-navyBlue-200 cursor-pointer text-white h-10 rounded-full text-center w-full mt-3 duration-200 ease-in transition-all hover:bg-navyBlue-100' disabled={verify.isPending}>
        {verify.isPending && (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {verify.isPending ? "در حال ارسال ..." : "تأیید"}
      </button>
    </form>
  );
};

export default VerifyForm;