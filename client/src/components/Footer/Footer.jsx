import React from 'react'

function Footer() {
  return (
    <div className='flex justify-between items-center flex-col md:flex-row text-white px-9 bg-gradient-to-r py-2 from-navyBlue-100 to-navyBlue-200 to-40%'>
        <p className='text-xs font-semibold md:text-sm lg:text-base'>MaqoolJewelry &copy; {new Date().getFullYear()} — Designing and making rings with silver</p>
        <h3 className='font-sans font-semibold text-xs md:text-sm lg:text-base'>Designed by Mahla</h3>
    </div>
  )
}

export default Footer;