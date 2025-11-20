import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { useQuery } from '@tanstack/react-query';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard'
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Cms from "./pages/Cms";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import VerifyCode from "./pages/forgot-password/VerifyCode";
import SetNewPassword from "./pages/forgot-password/SetNewPassword";
import VerifyForm from "./pages/VerifyForm";
import useAuthStore from './store/useAuthStore';
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Payment from "./pages/Payment";
import useCartStore from './store/useCartStore';
import AboutUs from './pages/AboutUs';
import ContactUsPage from './pages/ContactUsPage';
import Privacy from './pages/Privacy';
import Rules from './pages/Rules';
import NotFound from './pages/NotFound';
import axios from './lib/axios';

const App = () => {
  const isLoggedIn = useAuthStore(state=>state.isLoggedIn);
  const cart = useCartStore(state=>state.cart)
  const user = useAuthStore(state => state.user);

   const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      const res = await axios.get('/user/profile');
      return res.data.user;
    },
    enabled: !!user, // فقط اگر کاربر لاگین است
    staleTime: 1000 * 60 * 10, // 10 دقیقه کش
    retry: false,
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },{
      path: "/products",
      element: <AllProducts/>,
    },{
      path:'/privacy',
      element: <Privacy/>
    },{
      path: "/rules",
      element: <Rules/>
    },{
      path: "/aboutus",
      element: <AboutUs/>
    },{
      path:"/contactus",
      element: <ContactUsPage/>
    },{
      // route for user
      path: "/dashboard",
      element: <Dashboard/>,
    },
    {
      // route for user
      path: "/dashboard/:content",
      element: <Dashboard/>,
    },{
      path: "/products/:id",
      element: <ProductDetails/>,
    },{
      path: "admin/cms",
      element: isLoggedIn && profile?.role === "admin" ? <Cms/> : <Navigate to="/auth"/>
    },
    {
      path: "admin/cms/:content",
      element: isLoggedIn && profile?.role === "admin" ? <Cms/> : <Navigate to="/auth"/>
    },
    {
      path: "/auth",
      element: isLoggedIn ? <Navigate to='/'/> : <Auth/>
    },{
      path: "register/verify",
      element: <VerifyForm/>
    },{
      path: "/cart",
      element: <Cart/>
    },{
      path: "/cart/checkout",
      element: isLoggedIn && cart?.length>0 ? <Checkout/> : <Navigate to='/'/>
    },{
      path: "/cart/order-success/:orderId",
      element: <OrderSuccess/>
    },{
      path: "/cart/checkout/payment/:orderId",
      element: <Payment/>
    },{
      path: "/forgot-password",
      element: isLoggedIn ? <Navigate to='/'/> : <ForgotPassword/>
    },
    {
      path: "/reset-password/verifycode",
      element: isLoggedIn? <Navigate to='/'/> : <VerifyCode/>
    },
    {
      path: "/reset-password/setpass",
      element: <SetNewPassword/>
    },{
      path: "/*",
      element: <NotFound/>
    }
  ]);

  return (
    <>
      <ToastContainer position="top-center" rtl />
      <RouterProvider router={router} />
    </>
  );
};

export default App;