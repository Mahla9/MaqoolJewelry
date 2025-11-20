import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const useIranProvinces = () => {
  return useQuery({
    queryKey: ['iranProvinces'],
    queryFn: async () => {
      const res = await axios.get('https://iranplacesapi.liara.run/api/provinces'); 
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 ساعت کش
    refetchOnWindowFocus: false, // با هر فوکوس صفحه دوباره فچ نکند
    refetchOnMount: false, // با هر بار سوار شدن دوباره فچ نکند
  })
};

export const useIranCities = (province) => {
  return useQuery({
    queryKey: ['iranCities', province],
    queryFn: async ({ queryKey }) => {
      const [, selectedProvince] = queryKey;
      if (!selectedProvince) return [];
      const res = await axios.get(`https://iranplacesapi.liara.run/api/provinces/name/${selectedProvince}/cities`);
      return res.data;
    },
    enabled: !!province, // فقط وقتی province وجود داشت فچ کنه
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
