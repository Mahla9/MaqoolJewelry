import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../api/useAuth';
import useAuthStore from '../store/useAuthStore';
import { Button, Form, message } from 'antd';

function Login() {
    const navigate = useNavigate();
    const postUser = useLogin();
    const login = useAuthStore(state=>state.login);

    const onSubmit = async (values) => {
        try {
            const res = await postUser.mutateAsync(values);
            const {user: userData, token, redirect, message} = res.data;

            // ذخیره اطلاعات کاربر و توکن
            login(userData, token);

            // نمایش پیام موفقیت و هدایت کاربر
            message.success(message);
            navigate(redirect);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در ارتباط با سرور';
            message.error(errorMessage);
            console.error( errorMessage);
        }
    }
    return (
    <>
        <Form onFinish={onSubmit} dir='rtl' className='flex flex-col gap-3 md:gap-6'>
            <Form.Item label='نام کاربری' labelCol={{ span: 24 }} 
            className='text-xs font-semibold md:text-base text-navyBlue-100 pr-2 pb-1'
            rules={[ { required: true, message: 'لطفا نام کاربری را وارد کنید' }]} name="username"
            >
                <Input/>
            </Form.Item>

            <Form.Item label='پسورد' labelCol={{ span: 24 }} 
            className='text-xs font-semibold md:text-base text-navyBlue-100 pr-2 pb-1'
            hasFeedback
            rules={[ { required: true, message: 'لطفا پسورد را وارد کنید' },{pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: 'Password must contain uppercase, lowercase, number, and be at least 8 characters'}]} name="password"
            >
                <Input.Password/>
            </Form.Item>

            <Button htmlType='submit' loading={postUser.isPending} className={` text-white cursor-pointer bg-gradient-to-r  transition-all duration-200 ease-in hover:bg-gradient-to-l ${postUser.isPending? "from-navyBlue-100/50 to-navyBlue-200/50" : "from-navyBlue-100 to-navyBlue-200"}`} type='submit' disabled= {postUser.isPending}>
                {postUser.isPending ? "در حال ورود..." : "ورود"}
            </Button>
        </Form>

        <Link to={'/forgot-password'} className='text-xs font-semibold text-navyBlue-100 mt-2'>فراموشی رمز عبور؟</Link>
    </>
  )
}

export default Login;