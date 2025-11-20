import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';

const useGetUsers = () => {
  return useQuery(
    { 
        queryKey: ['users'] , 
        queryFn: async () => {
            const response = await axios.get('/admin/users');
            return response.data;
        }
    });
};

export default useGetUsers;