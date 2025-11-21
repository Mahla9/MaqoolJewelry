// hooks/useProfile.js
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios.js';
import useAuthStore from '../store/useAuthStore.js';

const useProfile = () => {
  const user = useAuthStore(state => state.user);
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const res = await axios.get('/user/profile');
      return res.data.user;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30, // 30 دقیقه
    gcTime: 1000 * 60 * 60, // 1 ساعت
    retry: false,
  });
};

export default useProfile;