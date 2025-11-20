import React from 'react'
import {PhoneCall, Clock,Mail, MapPin, Instagram} from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ContactUs from '../components/Main/ContactUsFooter';

function ContactUsPage() {
  return (
    <div>
        <div className='bg-navyBlue-200 pb-9'><Header/></div>

        <div id='contact-us' dir='rtl' className='container my-9 flex flex-col pr-9 py-3 border border-gray-400 rounded-xl '>
            <h2 className='text-xl md:text-4xl text-navyBlue-100 mb-2 md:mb-6'>تماس با ما</h2>
            <div className='flex flex-col gap-1 md:gap-3 '>
                <div className='flex gap-3 items-center'>
                    <MapPin className='size-7 md:size-9 stroke-custom-silver bg-navyBlue-100 p-1 rounded-lg'/>
                    <p className='text-xs font-semibold md:text-base '>مشهد، جنب بازار رضا، پاساژ جامع، طبقه2+ پ 46</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <PhoneCall className='stroke-navyBlue-100 size-7 md:size-9'/>
                    <p dir='ltr' className='text-xs font-semibold'>+98 935 390 0000</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <Mail className='stroke-custom-silver size-7 md:size-9 bg-navyBlue-100 p-1 rounded-lg'/>
                    <p className='text-xs font-semibold md:text-base'>maqooljewelry@gmail.com</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <Clock className='stroke-navyBlue-100 size-7 md:size-9'/>
                    <p className='text-xs font-semibold md:text-base'>مراجعه حضوری: 9 صبح الی 7 شب</p>
                </div>
                <div className='flex gap-3 items-center'>
                    <Instagram className='stroke-navyBlue-100 size-7 md:size-9'/>
                    <a href='https://www.instagram.com/maqool_jewelry?igsh=czNlNWs4ejllaWV3' className='text-xs font-semibold md:text-base'>maqooljewelry</a>
                </div>
            </div>
        </div>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default ContactUsPage
