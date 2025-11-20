import axios from '../lib/axios';
import { useMutation } from '@tanstack/react-query';

// این مرحله کد بازیابی ارسال میشه به ایمیل کاربر
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data) => axios.post("/user/forgot-password", data),
  });
};

// این مرحله کاربر کد بازیابی رو وارد کرده و حالا قراره کد وارد شده رو ارسال کنه
export const useVerifyCode = () => {
    return useMutation({
        mutationFn: (data) => axios.post('/user/reset-password/verifycode', data)
    });
}

// کد دریافتی تایید شده و پسورد جدید به همراه تایید نیوپسورد به سرور ارسال میشه
export const useSetPassword = () => {
    return useMutation({
        mutationFn: (data) => axios.post('/user/reset-password/setpass', data)
    });
}