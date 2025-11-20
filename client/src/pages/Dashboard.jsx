import React from 'react';

import Header from '../components/Header/Header';
import UserDashboardContent from '../components/UserDashboard/UserDashboardContent';
import UserDashboardTab from '../components/UserDashboard/UserDashboardTab';
import ContactUs from '../components/Main/ContactUsFooter';
import Footer from '../components/Footer/Footer';

function Dashboard() {


  return (
    <div className=' text-slate-600'>
      <div className='bg-navyBlue-200 pb-9'><Header/></div>
        <div dir='rtl' className='container h-full flex flex-col md:flex-row justify-between gap-6 my-9'>
          <UserDashboardTab/>
          <UserDashboardContent/>
        </div>
        <ContactUs/>
        <Footer/>
      </div>
  )
}

export default Dashboard
