import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth";

import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cart = lazy(() => import('./pages/Cart'));
const Cms = lazy(() => import('./pages/Cms'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import VerifyCode from "./pages/forgot-password/VerifyCode";
import SetNewPassword from "./pages/forgot-password/SetNewPassword";
import VerifyForm from "./pages/VerifyForm";
import useAuthStore from './store/useAuthStore';
import OrderSuccess from "./pages/OrderSuccess";
import Payment from "./pages/Payment";
import useCartStore from './store/useCartStore';
import AboutUs from './pages/AboutUs';
import ContactUsPage from './pages/ContactUsPage';
import Privacy from './pages/Privacy';
import Rules from './pages/Rules';
import NotFound from './pages/NotFound';
import useProfile from './api/useProfile';
import { StyleProvider } from '@ant-design/cssinjs';

const App = () => {
  const isLoggedIn = useAuthStore(state=>state.isLoggedIn);
  const cart = useCartStore(state=>state.cart);

  const {data: profile, isError, isPending} = useProfile();
  if(isError) console.log("Error fetching profile data");
  if(isPending) console.log("Loading profile data...");

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

  // Suspense wrapper
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-navyBlue-100"></div>
  </div>
);

  return (
    <StyleProvider layer={true}>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </StyleProvider>
  );
};

export default App;