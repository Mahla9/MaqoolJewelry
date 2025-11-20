import React, { useEffect } from 'react';
import Header from '../components/Header/Header';
import useCartStore from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { Button, Typography, InputNumber, Popconfirm, Empty, message } from 'antd'
import { ShoppingBasket, Trash } from 'lucide-react';
import CalculatePrices from '../components/CalculatePrices'

const { Title } = Typography

function Cart() {
    const { setCart: getCart, cart, clearCart, updateQuantity, deleteFromCart } = useCartStore(
        useShallow((state) => ({
            setCart: state.setCart,
            cart: state.cart,
            clearCart: state.clearCart,
            updateQuantity: state.updateQuantity,
            deleteFromCart: state.deleteFromCart
        }))
    );
    const navigate = useNavigate();
    

    const handleQuantityChange = (value, item) => {
        // مقدار صحیح موجودی را از item.product.stock بگیر
        const maxStock = item.product?.stock ?? item.stock ?? 1;
        if (value < 1) {
            message.error('تعداد باید بیشتر از صفر باشد.');
            return;
        }
        if (value > maxStock) {
            message.error(`موجودی این محصول فقط ${maxStock} عدد است.`);
            return;
        }
        // اگر مقدار معتبر بود، همان مقدار را ست کن
        updateQuantity(item._id, value);
    };

    // فقط یک بار هنگام mount اجرا شود
    useEffect(() => {
        getCart();
    }, [getCart]);

    // نمایش سبد خرید به صورت ستونی و بدون هدر جدول
    return (
        <div className='bg-navyBlue-200 min-h-screen pb-3'>
            <Header />
            <div dir='rtl' className='container m-h-[60%] bg-white my-12 md:my-8 rounded-xl px-2 py-6 flex flex-col md:flex-row justify-between gap-9'>
                <div>
                    <Title level={2}>سبد خرید</Title>
                    <div className="flex flex-col gap-6">
                        {cart && cart.length > 0 ? cart.map(item => (
                            <div key={item._id} className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
                                <div className="flex-shrink-0">
                                    <img src={`/${item.image.replace(/\\/g, '/')}`} alt="Product" style={{ width: 100, borderRadius: 8 }} />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <span className="font-bold">{item.title}</span>
                                    <span>قیمت: {item.price.toLocaleString('en-fa')} تومان</span>
                                    <span>تعداد: <InputNumber min={1} value={item.quantity} onChange={(value) => handleQuantityChange(value, item)} /></span>
                                </div>
                                <div>
                                    <Popconfirm
                                        title="آیا مطمئن هستید؟"
                                        onConfirm={() => deleteFromCart(item.product._id)}
                                        okText="بله"
                                        cancelText="خیر"
                                    >
                                        <Button icon={<Trash />} type="text" danger>حذف</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        )) : <Empty description="سبد خرید شما خالی است." />}
                    </div>
                </div>
                {cart?.length>0 && (
                    <div className='flex flex-col gap-6'>
                    <CalculatePrices/>
                    <div className='flex gap-3'>
                        <Button color='pink' variant='solid' onClick={() => navigate('/cart/checkout')}>تسویه حساب</Button>
                        <Button color='danger' variant='solid' 
                        onClick={async () => {
                            const result = await clearCart();
                            message.success(result.message);
                            }}>پاک کردن سبدخرید
                        </Button>
                        <Link to='/'>
                            <Button type='primary' icon={<ShoppingBasket className='stroke-1' />} >ادامه خرید</Button>
                        </Link>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
