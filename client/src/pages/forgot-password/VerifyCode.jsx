
import useForgotPassStore from '../../store/useForgotPassStore'
import { useVerifyCode } from '../../api/reset-forgotPass';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';

function VerifyCode() {
  const setIsCodeVerified = useForgotPassStore(state=>state.setIsCodeVerified);
  const confirmCode = useVerifyCode();
  const email = useForgotPassStore(state=>state.email);
  const setCode = useForgotPassStore(state=>state.setCode)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCode(e.target.code.value);
    const value = {code: e.target.code.value, email};
    console.log(value);
    try {
      const res = await confirmCode.mutateAsync(value);
      setIsCodeVerified();
      navigate('/reset-password/setpass');
      toast.success(res.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <>
    <div className='bg-navyBlue-200 pb-9'><Header/></div>
    <form dir='rtl' onSubmit={handleSubmit} className='w-full md:w-[50%] mx-auto flex items-center h-[80vh] justify-center gap-3 flex-col'>
      <label htmlFor="confirmCode">کد تایید:</label>
      <input type="text" name='code' id='confirmCode' placeholder='کد تایید خود را وارد کنید' className='rounded-full px-3 h-10 border border-slate-400  w-full'/>
      <button type="submit" className='bg-navyBlue-100 text-white rounded-full px-4 py-2 cursor-pointer'>ارسال</button>
    </form>
    </>
  )
}

export default VerifyCode;