import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import CartSummary from "../components/CartSummary";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const tempData = [];
    let totalPrice = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const productData = products.find((product) => product._id === items);

          // Skip if product not found
          if (!productData) continue;

          const itemTotal = productData.price * cartItems[items][item];

          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
            productData: productData,
            itemTotal: itemTotal,
          });

          totalPrice += itemTotal;
        }
      }
    }

    setCartData(tempData);
    setTotal(totalPrice);
  }, [cartItems, products]);

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[700px] text-gray-500">
        <FaShoppingCart size={80} className="mb-4 text-gray-300" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-400">
          Looks like you haven't added any items yet
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Title text1="MY " text2="CART" />
      </div>

      <div className="grid gap-6 md:grid-cols-[5fr_2fr]">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-6 border"
            >
              <img
                className="w-20 h-20 object-cover rounded-md"
                src={item.productData.image[0]}
                alt={item.productData.name}
              />

              <div className="flex-grow">
                <h3 className="font-semibold text-lg">
                  {item.productData.name}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <p>
                    {currency} {item.productData.price.toFixed(2)}
                  </p>
                  <div className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {item.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  className="w-16 border rounded px-2 py-1 text-center"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(
                          item._id,
                          item.size,
                          Number(e.target.value)
                        )
                  }
                />

                <button
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                >
                  <FaRegTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-sm rounded-lg sm:p-6 h-fit border">
          <CartSummary />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="w-full bg-gray-900 text-white py-3 rounded-lg my-8 hover:bg-blue-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
