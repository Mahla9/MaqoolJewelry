import React from 'react';
import CmsTab from '../components/CMS/CmsTab';
import CmsContent from '../components/CMS/CmsContent';
import Header from '../components/Header/Header';

function Cms() {
    
  return (
    <section>
      <div className='bg-navyBlue-200 pb-9'>
        <Header/>
      </div>

      <div className=' bg-gradient-to-b from-navyBlue-200 to-navyBlue-100 min-h-screen pb-9'>
          <div className='container w-full flex flex-col md:flex-row-reverse gap-6 justify-between items-center'>
              <CmsTab />
          

              <CmsContent />

          </div>
      </div>
    </section>
  )
}

export default Cms;
