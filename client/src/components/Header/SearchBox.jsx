import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Highlighter from 'react-highlight-words';
import { useGetProducts } from '../../api/productsAPI';
import { useDebounce } from 'use-debounce';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [DebounceQuery] = useDebounce(query, 600);

    // Fetch products based on the query
    const {data:AllData, isPending} = useGetProducts();
    const products = AllData?.data?.products;


  return (
    <div dir='rtl' className='relative h-10 w-full mx-3 rounded-full border border-navyBlue-100'>
        <input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='جستجو نام محصول ... ' className='w-full h-full placeholder-shown:text-xs font-semibold placeholder-shown:lg:text-base rounded-full px-3 backdrop-blur-3xl'/>
        <Search className='size-4 absolute top-1/2 -translate-y-1/2 left-3.5'/>
        {query && (
          <div className='absolute inset-x-0 top-10 w-[93%] mr-3 flex flex-col p-3 bg-white shadow-lg rounded-br-lg rounded-bl-xl'>
            {/* نمایش نتایج جستجو */}
            {products?.length > 0 && products.filter(product => product.title.includes(DebounceQuery)).map(product => (
              <div key={product._id} className='flex justify-between border-b border-slate-200 py-2'>
                
                <div className='flex gap-3 items-center text-xs font-semibold md:text-sm'>
                  <img src={`/${product.image.replace(/\\/g, '/')}`} className='w-12 h-7'/>
                  <h3>
                  <Highlighter
                  highlightClassName='text-indigo-600 bg-transparent font-bold'
                  searchWords={[DebounceQuery]}
                  autoEscape={true}
                  textToHighlight={product.title}
                />
                </h3>
                </div>
                 
                <div className='flex flex-col'>
                  <span className={`text-xs ${product.stock>0 ? "text-green-600 font-semibold" : "text-gray-500"} `}>{product.stock>0 ? "موجود" : "نا موجود"} </span>
                  <span className='text-xs text-gray-400'>{product.category}</span>
                </div>
              </div>
            ))}
            {isPending && <div className='p-2 flex gap-3 border-b border-gray-200'
            >در حال بارگذاری...
                <span className='w-6 h-6 rounded-full animate-spin border-4 border-navyBlue-100 border-t-transparent'></span>
              </div>}
          </div>
        )}
    </div>
  )
}

export default SearchBox;