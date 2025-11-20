import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';


async function getAdminInfo(){
    try {
        const response = await axios.get('/admin');
        return response.data
    } catch (error) {
        console.error('خطا در دریافت اطلاعات ادمین: ', error)
    }
}

const useGetAdminInfo = () => {
    return useQuery({
        queryKey:'admin',
        queryFn: getAdminInfo,
        staleTime: 1000*60*10,
    })
}

export default useGetAdminInfo;