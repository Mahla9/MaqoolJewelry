import React from 'react';

function RotatingImages() {
  return (
    <div className='mt-6 md:mt-9'>
      <img src="/baner3.jpg" alt="" className='hidden md:block w-full h-full object-cover'/>
      <img src='/baner2.jpg' className='md:hidden w-full h-full object-cover'/>
    </div>
  )
}

export default RotatingImages;