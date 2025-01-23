import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CartSummary = () => {
  const { getCartAmount, deliveryFee, currency } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <h3 className="font-semibold mb-4">Cart Summary</h3>
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Sub-Total</p>
          <p>
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {deliveryFee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + deliveryFee}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
