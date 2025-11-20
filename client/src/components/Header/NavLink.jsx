import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavLink() {
  const navigate = useNavigate();

  return (
    <ul className='flex gap-6 flex-col md:flex-row items-center justify-center mr-6 ml-3'>
        <li className='text-xs text-nowrap border-b border-slate-200 md:border-none md:text-sm transition-all duration-300 ease-in-out cursor-pointer h-10 leading-10 w-full pl-9 pr-3 md:h-auto md:leading-0 md:w-auto md:pl-0 md:pr-0 hover:text-white md:hover:text-slate-500 rounded-md hover:pl-16 hover:bg-navyBlue-100 md:hover:pl-0 md:hover:bg-none'
          onClick={() => navigate('/')}
        >
          خانه
        </li>

        <li className='text-xs text-nowrap border-b border-slate-200 md:border-none md:text-sm transition-all duration-300 ease-in-out cursor-pointer h-10 leading-10 w-full pl-9 pr-3 md:h-auto md:leading-0 md:w-auto md:pl-0 md:pr-0 hover:text-white md:hover:text-slate-500 rounded-md hover:pl-16 hover:bg-navyBlue-100 md:hover:pl-0 md:hover:bg-none'
          onClick={() => navigate('/aboutus')}
        >
          درباره ما
        </li>

        <li className='text-xs text-nowrap border-b border-slate-200 md:border-none md:text-sm transition-all duration-300 ease-in-out cursor-pointer h-10 leading-10 w-full pl-9 pr-3 md:h-auto md:leading-0 md:w-auto md:pl-0 md:pr-0 hover:text-white md:hover:text-slate-500 rounded-md hover:pl-16 hover:bg-navyBlue-100 md:hover:pl-0 md:hover:bg-none'
          onClick={() => navigate('/contactus')}
        >
          تماس با ما
        </li>

        <li className='text-xs text-nowrap border-b border-slate-200 md:border-none md:text-sm transition-all duration-300 ease-in-out cursor-pointer h-10 leading-10 w-full pl-9 pr-3 md:h-auto md:leading-0 md:w-auto md:pl-0 md:pr-0 hover:text-white md:hover:text-slate-500 rounded-md hover:pl-16 hover:bg-navyBlue-100 md:hover:pl-0 md:hover:bg-none'
          onClick={() => navigate('/products')}
        >
          محصولات
        </li>
    </ul>
  )
}

export default NavLink
