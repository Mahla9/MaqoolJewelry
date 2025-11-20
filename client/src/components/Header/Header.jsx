import React from 'react';
import TopHeader from './TopHeader';
import BottomFixHeader from './BottomFixHeader';

function Header() {
  return (
    <div className='pt-9 px-3 sm:px-0'>
        <TopHeader/>
        <BottomFixHeader/>
    </div>
  )
}

export default Header
