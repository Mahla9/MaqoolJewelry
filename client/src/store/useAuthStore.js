import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist((set) => ({
    user: null,
    isLoggedIn: false,
    isAdmin:false,
    email: '',

    login: (user) => set({ user, isLoggedIn:true }),
    logout: () => set({ user: null, isLoggedIn:false }),
    setEmail: (email) => set({ email }),
    setIsAdmin: (isAdmin) => set({ isAdmin })
  }),
  {
    name: 'auth-storage',
    partialize: (state) => (state.isLoggedIn ? {
      user: state.user,
      isLoggedIn: state.isLoggedIn
    } : {})
  }
));

export default useAuthStore;