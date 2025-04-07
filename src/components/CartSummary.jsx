import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartSummary = () => {
  const { getCartAmount, deliveryFee, currency } = useContext(ShopContext);

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="text-2xl font-bold text-gray-800 mb-6">
        <h3 className="relative inline-block">
          Cart Summary
          <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-transparent"></div>
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-gray-600">
          <p>Sub-Total</p>
          <p className="font-medium">
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent"></div>
        <div className="flex justify-between items-center text-gray-600">
          <p>Shipping Fee</p>
          <p className="font-medium">
            {currency} {deliveryFee}.00
          </p>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent"></div>
        <div className="flex justify-between items-center text-lg font-bold">
          <p>Total</p>
          <p className="text-pink-600">
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + deliveryFee}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
