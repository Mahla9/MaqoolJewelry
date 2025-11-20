import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// این تابع قیمت نقره را از سرور خودت می‌گیرد
const fetchSilverPrice = async () => {
  const res = await axios.get('/api/silver/price');
  return res.data.price;
};

export function useSilverPrice() {
  return useQuery({
    queryKey: ['silver-price'],
    queryFn: fetchSilverPrice,
    refetchInterval: 6 * 60 * 60 * 1000, // هر 6 ساعت
    staleTime: 6 * 60 * 60 * 1000,
  });
}

