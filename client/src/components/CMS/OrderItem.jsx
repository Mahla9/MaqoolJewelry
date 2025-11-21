import React from 'react'

function OrderItem({ order, setSelectedOrder, handleStatusChange, status }) {
    return (
        <div key={order._id} className='flex justify-between items-center rounded-xl p-3 border mb-3 gap-3'>
          <div className='flex flex-col gap-3'>
            <h3 className='text-xs font-semibold text-slate-400'>سفارش از : {order.shippingAddress?.province} - {order.shippingAddress?.city}</h3>
            <p className='text-xs font-semibold'>مجموع قیمت: {(order.totalPrice).toLocaleString('en-IR')} تومان</p>
            <button type='button' className='bg-green-500 rounded-xl h-10 px-3 md:px-6 text-white text-xs font-semibold transition-all ease-in duration-200 hover:bg-green-500/80 cursor-pointer' onClick={()=>setSelectedOrder(order)}>جزئیات</button>
          </div>

          <div className=' flex flex-col gap-3'>
            <div>
              <span className='text-xs'>وضعیت:</span>
              <span className='text-green-500 text-xs font-semibold'>{order.status}</span>
            </div>
            <select name="orderStatus" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className='focus:outline-none border py-2 border-slate-400 rounded-sm text-xs font-semibold'>
            {status.map((stat, index) => (
              <option key={index} value={stat}>
                {stat}
              </option>
            ))}
            </select>

          </div>
        </div>
    )
}

export default OrderItem
