import React, { useState } from 'react';
import SearchBox from './SearchBox';
import NavLink from './NavLink';
import NavIcon from './NavIcon';
import { Menu } from 'lucide-react';
import SidebarMenu from './SidebarMenu';

function TopHeader() {
    const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className='container py-2 px-6 flex justify-between items-center bg-gradient-to-l from-white/80 md:from-60% to-transparent rounded-2xl'>
        <img src="/logo-header.png" alt="logo" className='w-32'/>

        <div className='w-full hidden md:flex'>
            <SearchBox/>
            <NavLink />
            <NavIcon/>
        </div>

        <Menu className='block md:hidden size-9 text-lavender-400 cursor-pointer transition-all duration-300 ease-in hover:text-navyBlue-100'
            onClick={()=>setShowSidebar(true)}
        />
        <SidebarMenu setShowSidebar={setShowSidebar} showSidebar={showSidebar}/>
    </div>
  );
};

export default TopHeader;