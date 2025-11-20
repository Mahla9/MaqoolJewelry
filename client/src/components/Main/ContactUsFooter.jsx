import { Instagram, MapPin, PhoneCall } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function ContactUs() {
  return (
    <div className='flex justify-between flex-col sm:flex-row pb-2 md:pb-0 bg-[#f0eff1]'>
        <img src="/logo-contact-us.png" alt="logo" className='sm:w-1/2 object-contain'/>

        <div id='contact-us' dir='rtl' className='sm:w-1/2 flex flex-col justify-center pr-9 '>
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
                    <Instagram className='stroke-navyBlue-100 size-7 md:size-9'/>
                    <a href='https://www.instagram.com/maqool_jewelry?igsh=czNlNWs4ejllaWV3' className='text-xs font-semibold md:text-base transition-all duration-200 hover:text-navyBlue-100/80'>maqooljewelry</a>
                </div>

            </div>
            <div className='flex flex-col gap-3 my-3'>
                <Link to={'/privacy'} className='text-gray-800 transition-all duration-200 ease-in hover:text-gray-500 underline underline-offset-8 text-xs font-semibold md:text-base'> حریم خصوصی </Link>
                <Link to={"/rules"} className='text-gray-800 transition-all duration-200 ease-in hover:text-gray-500 underline underline-offset-8 text-xs font-semibold md:text-base'> قوانین و شرایط </Link>
            </div>
        </div>
    </div>
  )
}

export default ContactUs
