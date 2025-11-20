import React from 'react';
// import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header'
import AboutBrand from '../components/Main/AboutBrand';
import Collections from '../components/Main/Collections';
import ContactUs from '../components/Main/ContactUsFooter';
import Footer from '../components/Footer/Footer';
import RotatingImages from '../components/Main/RotatingImages';

function Home() {
  // const navigate = useNavigate();


  return (
    <>
    <header className=' bg-gradient-to-b from-85% from-navyBlue-200 to-navyBlue-100'>
        <Header/>
        <RotatingImages/>
    </header>

    <main>
        <div className='bg-custom-silver'><AboutBrand/></div>
        <div className='bg-navyBlue-200 py-9'><Collections/></div>
        <div className='bg-[#f0eff1]'><ContactUs/></div>
    </main>

    <footer className='bg-gradient-to-r from-navyBlue-100 to-navyBlue-200 py-4 mb-14 md:mb-0'>
       <Footer/>
    </footer>
    
    </>
  )
}

export default Home
