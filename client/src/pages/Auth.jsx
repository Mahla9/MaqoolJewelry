import React, { useState } from 'react'
import Register from '../components/Register'
import Login from '../components/Login';


function Auth() {
  const [isActive, setIsActive] = useState(false);
  


  return (
    <div className='bg-gray-200 min-h-screen flex items-center justify-center'>
      <div className="overflow-hidden flex items-center justify-center w-[90%] md:w-[60%] bg-white rounded-4xl h-[116vh] sm:h-[110vh] md:h-[80vh] relative container">

        <div className={`h-full w-full absolute toggle-box ${isActive ? "active" : ""}`} >
          <div className={`py-16 md:py-40 absolute w-full h-1/2 md:w-1/2 md:h-full text-white flex flex-col gap-3 items-center justify-between ${isActive ? "-bottom-6 md:right-0 md:bottom-auto" : "-bottom-1/2 md:-right-1/2 md:bottom-auto"}`}>
            <h1 className=" text-xl font-bold">خوش آمدید</h1>
            <div className='flex flex-col gap-3'>
              <p className='text-xs font-semibold sm:text-base'>حسابی نساخته اید؟</p>
              <button type='button' onClick={()=>{setIsActive(false);}} className="cursor-pointer border-2 border-white text-center rounded-xl md:rounded-2xl px-8 md:px-10 h-10 md:h-12 lg:h-14">ثبت نام</button>
            </div>
          </div>

          <div className={`py-16 md:py-40 text-white absolute w-full h-1/2 md:w-1/2 md:h-full flex flex-col justify-between items-center ${isActive ? " -top-1/2 md:-left-1/2" : " -top-5 md:left-0 md:top-auto"}`}>
            <h1 className="text-xl font-bold">خوش آمدید</h1>
            <div className='flex flex-col gap-3'>
              <p className='text-xs font-semibold md:text-base lg:text-lg'>حسابی از قبل دارین؟</p>
              <button type='button' onClick={()=>{setIsActive(true)}} className="cursor-pointer border border-white text-center rounded-xl md:rounded-2xl px-8 md:px-10 h-10 md:h-12 lg:h-14">ورود</button>
            </div>
          </div>
        </div>

        <div className={`w-[79%] sm:w-[66%] md:w-[43%] absolute transition-all ease-in ${isActive?" top-10 h-1/2 md:left-6 md:top-auto duration-1000": "-top-1/2 md:-left-1/2 md:top-auto invisible"}`}><Login/></div>
        <div className={`w-[79%] sm:w-[66%] md:w-[43%] absolute transition-all ease-in ${!isActive?" bottom-10 h-1/2 md:right-6 md:bottom-auto duration-1000" : "-bottom-1/2 md:-right-1/2 md:bottom-auto invisible"}`}><Register/></div>
      </div>
    </div>
  )
}

export default Auth;
