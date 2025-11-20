import React from 'react';
import NavIcon from './NavIcon';

function BottomFixHeader() {
  return (
    <div className='md:hidden z-10 fixed bottom-0 inset-x-0 bg-white px-6 py-2 shadow-2xl shadow-slate-900'>
        <NavIcon/>
    </div>
  )
}

export default BottomFixHeader
