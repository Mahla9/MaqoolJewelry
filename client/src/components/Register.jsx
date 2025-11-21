import { useNavigate } from 'react-router-dom';
import { useRegister } from '../api/useAuth';
import useAuthStore from '../store/useAuthStore';
import { Button, Form, Input, message } from 'antd';


function Register() {
    const navigate = useNavigate();
    const register = useRegister();
    const setEmail = useAuthStore((state) => state.setEmail);

    const onSubmit = async (user) => {

        try {
            const res = await register.mutateAsync(user);
            const { message } = res.data;
            setEmail(user.email);
            navigate('/register/verify');
            message.success(message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در ثبت نام';
            message.error(errorMessage);
            console.error('خطا در ثبت نام:', errorMessage);
        }
    }

    return (
    <Form className='flex justify-between flex-col gap-y-2 md:gap-y-3.5' onFinish={onSubmit} dir='rtl'>
        <Form.Item label='نام کاربری' className='flex flex-col' name='username' rules={[{ required: true, message: 'Username is required' }]}>
            <Input className='bg-transparent border focus:outline-none border-navyBlue-100' />
        </Form.Item>

        <Form.Item className='flex flex-col' label='ایمیل' name='email' rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Invalid email format' }]}>
            <Input className='bg-transparent border focus:outline-none border-navyBlue-100' />
        </Form.Item>

        <Form.Item className='flex flex-col' label='پسورد' name='password' hasFeedback rules={[
            { required: true, message: 'Password is required' },
            {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message:
                'Password must contain uppercase, lowercase, number, and be at least 8 characters',
            },
        ]}>
            <Input className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5'/>
        </Form.Item>

        <Form.Item hasFeedback className='flex flex-col' label='تأیید پسورد' name='confirmPassword' dependencies={['password']} rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                },
            }),
        ]}>
            <Input className='bg-transparent border focus:outline-none border-navyBlue-100 rounded-full h-8 md:h-10 px-3.5' type="password" id='confirmPassword'/>
        </Form.Item>

        <Button htmlType="submit" loading={register.isPending} className={`border-none cursor-pointer text-white h-10 rounded-full text-center w-full mt-3 duration-200 ease-in transition-all hover:bg-navyBlue-100`} disabled= {register.isPending}>
            {register.isPending ? "در حال ارسال داده ..." : "ثبت نام"}
        </Button>

        {register.isError && (
            <p className='text-red-400 text-xs font-semibold'>{register.error.message}</p>
        )}
    </Form>
    )
}

export default Register;