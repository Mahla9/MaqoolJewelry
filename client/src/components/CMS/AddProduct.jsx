import React from 'react';
import { useForm } from 'react-hook-form'
import { useSendProduct } from '../../api/productsAPI';
import { toast } from 'react-toastify'
import { useSilverPrice } from '../../api/useSilverPrice';

function AddProduct() {
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const sendProduct = useSendProduct();

    const {data:silverPrice, isLoading, isError} = useSilverPrice()

    const onSubmit = async (newProduct) => {
        const productId = Date.now() ;
        const formData = new FormData();
        formData.append('productId', productId);
        formData.append('title', newProduct.title);
        formData.append('price', newProduct.price);
        formData.append('description', newProduct.description);
        formData.append('category', newProduct.category);
        formData.append('stock', newProduct.stock);
        formData.append('ringSize', newProduct.ringSize || '');
        formData.append('metalType', newProduct.metalType || '');
        formData.append('jewelleryType', newProduct.jewelleryType || '');
        formData.append('jewellerySize', newProduct.jewellerySize || '');
        formData.append('weight', newProduct.weight || '');

        // فایل اصلی
        if (newProduct.image && newProduct.image[0]) {
            formData.append('image', newProduct.image[0]);
        }

        // گالری
        if (newProduct.gallery && newProduct.gallery.length > 0) {
            Array.from(newProduct.gallery).forEach((file) => {
              console.log('gallery:', newProduct.gallery);
              console.log('gallery type:', typeof newProduct.gallery);
              console.log('gallery instanceof FileList:', newProduct.gallery instanceof FileList);
              formData.append('gallery', file);
            });
          }

        try {
          const res = await sendProduct.mutateAsync(formData);
          const {message} = res.data;
          toast.success(message);
          reset();
        } catch (error) {
          const ErrMessage = error?.response?.data?.message || 'خطا در افزودن محصول';
          console.error(ErrMessage);
          toast.error(ErrMessage);
        }
    }

  return (
    <div className='flex items-center flex-col gap-5' dir='rtl'>
      
      <h2 className='font-semibold text-navyBlue-100 text-xl'>افزودن محصول</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full h-full gap-6'>
        <input {...register('title', {required: 'پر کردن این فیلد الزامی است'})} type="text" placeholder="نام محصول" className="border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold p-2 mb-2 w-full rounded-xl" />
        {errors.title && <p className='text-red-400 text-xs font-semibold'>{errors.title.message}</p>}

        <input {...register('price', {required: 'پر کردن این فیلد الزامی است'})} type="text" placeholder="قیمت محصول" className="border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold p-2 mb-2 w-full rounded-xl" />
        {errors.price && <p className='text-red-400 text-xs font-semibold'>{errors.price.message}</p>}

        <input type="text" disabled value={silverPrice ?? ''} className='border border-slate-300 h-10 rounded-xl'/>
        {isError && <p className='text-red-400 text-xs font-semibold'>خطا در دریافت قیمت نقره</p>}
        {isLoading && <p className='text-gray-400 text-xs font-semibold'>در حال بارگذاری قیمت یک انس نقره...</p>}

        <textarea {...register('description', {required: 'پر کردن این فیلد الزامی است'})} rows={6} placeholder="توضیحات محصول" className="border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold p-2 mb-2 w-full rounded-xl" />
        {errors.description && <p className='text-red-400 text-xs font-semibold'>{errors.description.message}</p>}

        <input {...register('stock')} type='number' placeholder='تعداد موجودی' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>

        <input {...register('ringSize')} type='text' placeholder='سایز انگشتر' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>

        <input {...register('metalType')} type='text' placeholder='نوع فلز' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>

        <input {...register('jewelleryType')} type='text' placeholder='نوع جواهر' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>

        <input {...register('jewellerySize', {required: 'پر کردن این فیلد الزامی است'})} type='text' placeholder='سایز جواهر' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>
        {errors.jewellerySize && <p className='text-red-400 text-xs font-semibold'>{errors.jewellerySize.message}</p>}

        <input {...register('weight', {required: 'پر کردن این فیلد الزامی است'})} type='text' placeholder='وزن' className='w-[26%] md:w-[20%] border border-slate-400 placeholder-shown:text-xs placeholder-shown:font-semibold rounded-md px-4 py-2'/>
        {errors.weight && <p className='text-red-400 text-xs font-semibold'>{errors.weight.message}</p>}

        <div className='flex flex-col my-2'>
          <label htmlFor="category" className='text-slate-500 text-sm font-semibold'>دسته بندی</label>

          <select  {...register('category')} defaultValue='انگشتر مردانه' id="category" className='w-[26%] md:w-[20%] text-xs font-semibold border border-slate-400 px-4 py-2 rounded-md'>
          <option value="انگشتر مردانه">انگشتر مردانه</option>
          <option value="انگشتر زنانه">انگشتر زنانه</option>
          <option value="گردنبند">گردنبند</option>
          <option value="مدال">مدال</option>
        </select>  
        </div>

        {/* بخش انتخاب یک فایل */}
        <div>
            <label
            htmlFor="single-file"
            className="w-[40%] md:w-[30%] text-xs font-semibold cursor-pointer border border-slate-400 rounded-xl h-10 flex items-center justify-center mb-2 bg-white"
          >
            انتخاب تصویر اصلی محصول
          </label>
          <input {...register('image', {required: 'پر کردن این فیلد الزامی است'})}
            type="file"
            id="single-file"
            name='image'
            accept="image/*"
          />
          {errors.image && <p className='text-red-400 text-xs font-semibold'>{errors.image.message}</p>}
        </div>


        {/* بخش انتخاب چندگانه تصویر */}
        <div>
            <label
            htmlFor="multi-file"
            className="w-[40%] md:w-[30%] text-xs font-semibold cursor-pointer border border-slate-400 rounded-xl h-10 flex items-center justify-center mb-2 bg-white"
          >
            انتخاب تصاویر برای گالری
          </label>
          <input {...register('gallery',)}
            type="file"
            id="multi-file"
            name='gallery'
            accept="image/*"
            multiple
          />
          {errors.gallery && <p className='text-red-400 text-xs font-semibold'>{errors.gallery.message}</p>}
        </div>
        <button type="submit" className={`${sendProduct.isPending ? "bg-navyBlue-100/50": "bg-navyBlue-100"} text-white p-2 rounded-xl cursor-pointer transition-all duration-150 ease-in hover:bg-navyBlue-200/79`}>
            {sendProduct.isPending && <div className='animate-spin w-6 h-6 rounded-full border-2 border-t-transparent border-white'></div>}
            {sendProduct.isPending? "در حال افزودن..." : "افزودن محصول"}
        </button>
      </form>
    </div>
  )
}

export default AddProduct;