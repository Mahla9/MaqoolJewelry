import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // چون از proxy در vite استفاده می‌کنی
  withCredentials: true, // کوکی‌ها و CSRF رو فعال کن
});

// CSRF interceptor: always ensure token is set and auto-refresh on 403
let isFetchingCSRF = false;
let csrfPromise = null;

instance.interceptors.request.use(async (config) => {
  // اگر توکن ست نشده یا درخواست POST/PUT/DELETE است، توکن را ست کن
  if (!instance.defaults.headers.common['X-CSRF-Token'] && ['post','put','patch','delete'].includes(config.method)) {
    if (!isFetchingCSRF) {
      isFetchingCSRF = true;
      csrfPromise = instance.get('/csrf-token').then(res => {
        instance.defaults.headers.common['X-CSRF-Token'] = res.data.csrfToken;
        isFetchingCSRF = false;
        return res.data.csrfToken;
      });
    }
    await csrfPromise;
  }
  return config;
});

instance.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && error.response.data?.message?.includes('CSRF')) {
      // اگر توکن CSRF نامعتبر بود، یک بار دیگر توکن را بگیر و درخواست را تکرار کن
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const res = await instance.get('/csrf-token');
        instance.defaults.headers.common['X-CSRF-Token'] = res.data.csrfToken;
        originalRequest.headers['X-CSRF-Token'] = res.data.csrfToken;
        return instance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
