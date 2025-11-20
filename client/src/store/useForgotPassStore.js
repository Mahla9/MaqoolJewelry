import { create } from "zustand";
import { persist } from "zustand/middleware";

const useForgotPassStore = create(
    persist(set=>({
        email: '',
        isCodeVerified: false,
        code: '',

        setEmail: (input) => set({email: typeof input === 'string' ? input : input?.email || ''}),
        setCode: (input) => set({code: input}),
        setIsCodeVerified: () => set({isCodeVerified: true}),
        resetForgotPassword: ()=> set({email: '', code: '', isCodeVerified:false})
    }),{
        name:'forgot-pass',
        partialize: (state) => ({
            email: state.email,
        })
    })
)

export default useForgotPassStore;