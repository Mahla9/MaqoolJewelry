import React from 'react'

function OrderDetailsModal({order, onClose}) {
    return (
        <>
            {/* overlay */}
            <div className='fixed inset-0 bg-navyBlue-100/30' onClick={()=>onClose(null)}></div>

            <div className='fixed left-1/2 top-1/2 -translate-1/2 flex flex-col gap-6 justify-center items-center bg-white p-3 rounded-xl'>
                <h4 className='text-navyBlue-100 font-bold text-lg'>جزئیات سفارش</h4>
                <p>شماره سفارش: {order._id}</p>
                <span>نام و نام خانوادگی گیرنده: {order.shippingAddress?.firstname} {order.shippingAddress?.lastname}</span>
                <p>آدرس ارسال: {order.shippingAddress?.province} - {order.shippingAddress?.city} - {order.shippingAddress?.address}</p>
                <span>کدپستی: {order.shippingAddress?.postalCode}</span>
                <span>شماره تماس: {order.shippingAddress?.phone}</span>
                <h5 className='font-semibold'>محصولات:</h5>
                <ul>
                {order?.products?.map(item => (
                    <li key={item._id}>
                    {item.title} - {item.quantity} عدد
                    </li>
                ))}
                </ul>
            </div>
        </>
    )
}

export default OrderDetailsModal
