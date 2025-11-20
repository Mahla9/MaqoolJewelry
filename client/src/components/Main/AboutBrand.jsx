import React from 'react'

function AboutBrand() {
  return (
    <div className='container py-8 flex flex-col gap-9 md:flex-row items-center justify-between' >
        <div dir='rtl' className='flex items-start flex-col gap-6 '>
            <h2 className='text-navyBlue-100 font-semibold text-lg md:text-xl lg:text-3xl'>جواهری معقول | Maqool Jewelry</h2>
            <p className='text-slate-600'>هنر دست‌ساز، اصالت و زیبایی</p><br /> 
            <h2 className='font-semibold'>چرا جواهرات معقول؟</h2>
            <ul className='list-disc list-inside'>
              <li> ۱۰۰٪ دست‌ساز – هر قطعه با ساعت‌ها دقت، تمرکز و عشق ساخته می‌شود</li>
              <li> مواد اولیه‌ی درجه‌یک – استفاده از سنگ‌های طبیعی و نقره‌ی مرغوب با ضمانت اصالت</li>
              <li> تلفیق هنر سنتی و طراحی مدرن – از تراش عقیق گرفته تا طراحی‌های خاص و معاصر</li>
              <li> سفارشی‌سازی بر اساس سلیقه شما – هر اثر می‌تواند بازتابی از شخصیت و خواست قلبی‌تان باشد</li>
              <li>تعهد به کیفیت – استفاده از بهترین متریال با دقت در کوچک‌ترین جزئیات</li>
            </ul>

            <p className='font-semibold mt-3'>شما میتوانید برای ثبت سفارش خصوصی به واتس آپ مراجعه فرمائید</p>
            
        </div>
        <div className='relative max-w-72' >
            <img src='/box-ring.png' className='w-full h-full '/>
        </div>
    </div>
  )
}

export default AboutBrand
