import {useMutation} from '@tanstack/react-query';
import axios from '../lib/axios';


export const useLogin = () => {
    return useMutation({
        mutationFn: (user) => axios.post('/user/login', user)
    });
}


export const useRegister = () => {
    return useMutation({
        mutationFn: (user) => axios.post('/user/register', user)
    });
}


export const useVerify = () => {
    return useMutation({
        mutationFn: (user) => axios.post('/user/register/verify', user)
    });
}


export const useLogout = () => {
    return useMutation({
        mutationFn: () => axios.post("/user/logout")
    });
}