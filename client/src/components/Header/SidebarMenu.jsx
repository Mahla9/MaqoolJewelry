import React from 'react'
import SearchBox from './SearchBox'
import NavLink from './NavLink'

function SidebarMenu({showSidebar, setShowSidebar}) {
  return (
    <>
        <div className={`bg-black opacity-60 fixed inset-0 ${showSidebar?"block":"hidden"}`} onClick={()=>setShowSidebar(false)}></div>

        <div className={`flex flex-col gap-3 fixed right-0 inset-y-0 bg-white pl-6 pr-2 py-2 transition-all duration-200 ease-in ${showSidebar ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className='py-3 pr-3 flex justify-between items-center flex-row-reverse'>
            <button className='text-blue-900 text-xs font-semibold cursor-pointer' onClick={() => setShowSidebar(false)}> Close</button>
            <h2 className='text-xs text-blue-900 font-semibold'>منو</h2>
          </div>
          <div className='flex flex-col gap-8 items-end'>
            <SearchBox/>
            <NavLink/>
          </div>
        </div>
    </>
  )
}

export default SidebarMenu
