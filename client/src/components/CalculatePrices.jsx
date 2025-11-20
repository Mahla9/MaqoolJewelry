import React, { useEffect } from 'react';
import useCartStore from '../store/useCartStore';
import { useShallow } from 'zustand/shallow';


function CalculatePrices() {

const { subtotalPrice, shippingCost, totalPrice, calculatePrices } = useCartStore(
  useShallow(state => ({
      subtotalPrice: state.subtotalPrice,
      shippingCost: state.shippingCost,
      totalPrice: state.totalPrice,
      calculatePrices: state.calculatePrices
    }))
  );
  useEffect(()=>{
    calculatePrices();
    console.log(subtotalPrice, shippingCost, totalPrice);
  }, [subtotalPrice, shippingCost, totalPrice, calculatePrices]);

  return (
    subtotalPrice > 0 && (
      <div className="border-t border-slate-500 md:border-r md:border-t-0 pt-4 mt-4 px-9">
        <h3 className="font-bold mb-2">جمع کل</h3>
        <div className="flex justify-between py-3 border-b border-slate-300">
          <span>جمع موقت:</span>
          <span>{subtotalPrice.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between py-3 border-b border-slate-300">
          <span>هزینه ارسال:</span>
          <span>{shippingCost.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between font-bold py-3">
          <span>مجموع پرداخت:</span>
          <span>{totalPrice.toLocaleString()} تومان</span>
        </div>
      </div>
    )
  )
}

export default CalculatePrices
