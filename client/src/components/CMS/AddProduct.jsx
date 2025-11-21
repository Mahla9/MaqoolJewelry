import { useState } from 'react';
import { useSendProduct } from '../../api/productsAPI';
import { useSilverPrice } from '../../api/useSilverPrice';
import { Button, Form, Input, message, Select, Tag, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function AddProduct() {
    const sendProduct = useSendProduct();
    const [form] = Form.useForm();
    
    // State برای تصویر اصلی
    const [mainImage, setMainImage] = useState(null);
    
    // State برای گالری
    const [galleryFiles, setGalleryFiles] = useState([]);

    const { data: silverPrice, isLoading, isError } = useSilverPrice();

      // Validation فرمت فایل
    const validateImageFormat = (file) => {
        const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const isValidFormat = allowedFormats.includes(file.type);
        
        if (!isValidFormat) {
            message.error('فقط فرمت‌های PNG, JPG, JPEG و WebP مجاز هستند!');
        }
        
        return isValidFormat;
    };

    // Validation حجم فایل
    const validateImageSize = (file) => {
        const maxSize = 5; // 5MB
        const isValidSize = file.size / 1024 / 1024 < maxSize;
        
        if (!isValidSize) {
            message.error(`حجم فایل نباید بیشتر از ${maxSize}MB باشد!`);
        }
        
        return isValidSize;
    };

    // Handler برای تصویر اصلی
    const handleMainImageChange = ({ file, fileList }) => {
        if (fileList.length > 0) {
            setMainImage(file.originFileObj || file);
        } else {
            setMainImage(null);
        }
    };

    // Handler برای گالری
    const handleGalleryChange = ({ fileList }) => {
        const files = fileList.map(file => file.originFileObj || file);
        setGalleryFiles(files);
    };

    
    const onSubmit = async (values) => {
        // Validation برای تصویر اصلی
        if (!mainImage) {
            message.error('لطفاً تصویر اصلی محصول را انتخاب کنید');
            return;
        }

        const productId = Date.now();
        const formData = new FormData();

        // اطلاعات پایه
        formData.append('productId', productId);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('stock', values.stock);
        formData.append('silverWeight', values.silverWeight);
        
        // اطلاعات اختیاری
        formData.append('stoneCost', values.stoneCost || 0);
        formData.append('makingFee', values.makingFee || 0);
        formData.append('ringSize', values.ringSize || '');
        formData.append('metalType', values.metalType || '');
        formData.append('jewelleryType', values.jewelleryType || '');
        formData.append('jewellerySize', values.jewellerySize || '');

        // محاسبه قیمت نهایی (اگر نیاز دارید)
        // const totalPrice = (values.silverWeight * silverPrice) + (values.stoneFee || 0) + (values.makingFee || 0);
        // formData.append('price', totalPrice);

        // تصویر اصلی
        formData.append('image', mainImage);

        // گالری
        if (galleryFiles.length > 0) {
            galleryFiles.forEach((file) => {
                formData.append('gallery', file);
            });
        }

        try {
            const res = await sendProduct.mutateAsync(formData);
            message.success(res.data.message || 'محصول با موفقیت اضافه شد');
            
            // Reset form و state ها
            form.resetFields();
            setMainImage(null);
            setGalleryFiles([]);
            
        } catch (error) {
            const errMessage = error?.response?.data?.message || 'خطا در افزودن محصول';
            console.error('Error:', errMessage);
            message.error(errMessage);
        }
    };

    return (
        <div className='flex items-center flex-col gap-5' dir='rtl'>
            <h2 className='font-semibold text-navyBlue-100 text-xl'>افزودن محصول</h2>
            
            <Form 
                form={form}
                onFinish={onSubmit} 
                layout="vertical"
                className='w-full'
            >
                {/* نام محصول */}
                <Form.Item 
                    label="نام محصول" 
                    name="title" 
                    rules={[{ required: true, message: 'پر کردن این فیلد الزامی است' }]}
                >
                    <Input placeholder="نام محصول" />
                </Form.Item>

                {/* وزن نقره */}
                <Form.Item 
                    label="وزن نقره (گرم)" 
                    name="silverWeight" 
                    rules={[{ required: true, message: 'پر کردن این فیلد الزامی است' }]}
                >
                    <Input 
                        type='number' 
                        placeholder='مثال: 23.3' 
                        step="0.01"
                    />
                </Form.Item>

                {/* بهای سنگ */}
                <Form.Item 
                    label='بهای سنگ/نگین (تومان)' 
                    name='stoneFee'
                >
                    <Input type='number' placeholder="اختیاری" />
                </Form.Item>

                {/* اجرت کار */}
                <Form.Item 
                    label='اجرت کار (تومان)' 
                    name='makingFee'
                >
                    <Input type='number' placeholder="اختیاری" />
                </Form.Item>

                {/* قیمت نقره */}
                <Form.Item label='قیمت یک انس نقره'>
                    {isLoading ? (
                        <Tag color="processing">در حال بارگذاری...</Tag>
                    ) : isError ? (
                        <Tag color="error">خطا در دریافت قیمت</Tag>
                    ) : (
                        <Tag color="blue" className='text-sm'>
                            {silverPrice ? `${silverPrice.toLocaleString('fa-IR')} تومان` : 'نامشخص'}
                        </Tag>
                    )}
                </Form.Item>

                {/* توضیحات */}
                <Form.Item 
                    label="توضیحات محصول" 
                    name="description" 
                    rules={[{ required: true, message: 'پر کردن این فیلد الزامی است' }]}
                >
                    <Input.TextArea 
                        rows={6} 
                        placeholder="توضیحات کامل محصول" 
                    />
                </Form.Item>

                {/* موجودی */}
                <Form.Item 
                    label="تعداد موجودی" 
                    name="stock" 
                    rules={[{ required: true, message: 'پر کردن این فیلد الزامی است' }]}
                >
                    <Input 
                        type='number' 
                        placeholder='تعداد موجودی' 
                        min={0}
                    />
                </Form.Item>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* سایز انگشتر */}
                    <Form.Item 
                        label="سایز انگشتر" 
                        name="ringSize"
                    >
                        <Input placeholder='مثال: 18' />
                    </Form.Item>

                    {/* نوع فلز */}
                    <Form.Item 
                        label="نوع فلز" 
                        name="metalType"
                    >
                        <Input placeholder='مثال: نقره 925' />
                    </Form.Item>

                    {/* نوع جواهر */}
                    <Form.Item 
                        label="نوع جواهر" 
                        name="jewelleryType"
                    >
                        <Input placeholder='مثال: عقیق' />
                    </Form.Item>

                    {/* سایز جواهر */}
                    <Form.Item 
                        label="سایز جواهر" 
                        name="jewellerySize"
                    >
                        <Input placeholder='اختیاری' />
                    </Form.Item>
                </div>

                {/* دسته بندی */}
                <Form.Item 
                    label='دسته بندی' 
                    name='category' 
                    rules={[{ required: true, message: 'انتخاب دسته بندی الزامی است' }]}
                >
                    <Select placeholder="انتخاب کنید">
                        <Select.Option value="انگشتر مردانه">انگشتر مردانه</Select.Option>
                        <Select.Option value="انگشتر زنانه">انگشتر زنانه</Select.Option>
                        <Select.Option value="گردنبند">گردنبند</Select.Option>
                        <Select.Option value="مدال">مدال</Select.Option>
                    </Select>
                </Form.Item>

                {/* تصویر اصلی */}
                <Form.Item label='تصویر اصلی محصول' required>
                    <Upload 
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        maxCount={1}
                        listType="picture-card"
                        beforeUpload={(file) => {
                            const isValidFormat = validateImageFormat(file);
                            const isValidSize = validateImageSize(file);
                            
                            if (isValidFormat && isValidSize) {
                                return false;
                            }
                            return Upload.LIST_IGNORE;
                        }}
                        onChange={handleMainImageChange}
                    >
                        {!mainImage && (
                            <div className="flex flex-col items-center">
                                <UploadOutlined style={{ fontSize: '24px' }} />
                                <div style={{ marginTop: 8 }}>انتخاب تصویر</div>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                    PNG, JPG, WebP (Max: 5MB)
                                </div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                {/* گالری تصاویر */}
                <Form.Item label='گالری تصاویر (حداکثر 3 تصویر)'>
                    <Upload
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        listType='picture-card'
                        maxCount={3}
                        multiple
                        beforeUpload={(file) => {
                            const isValidFormat = validateImageFormat(file);
                            const isValidSize = validateImageSize(file);
                            
                            if (isValidFormat && isValidSize) {
                                return false;
                            }
                            return Upload.LIST_IGNORE;
                        }}
                        onChange={handleGalleryChange}
                    >
                        {galleryFiles.length < 3 && (
                            <div className="flex flex-col items-center">
                                <UploadOutlined style={{ fontSize: '24px' }} />
                                <div style={{ marginTop: 8 }}>افزودن تصویر</div>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                    PNG, JPG, WebP (Max: 5MB)
                                </div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>

                {/* دکمه ارسال */}
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={sendProduct.isPending}
                        disabled={sendProduct.isPending}
                        block
                        size="large"
                        className='bg-navyBlue-100 hover:bg-navyBlue-200'
                    >
                        {sendProduct.isPending ? "در حال افزودن..." : "افزودن محصول"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddProduct;