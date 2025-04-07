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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const tempData = [];
    let totalPrice = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const productData = products.find((product) => product._id === items);

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
    setTimeout(() => setLoading(false), 500); // Add loading delay for smooth transition
  }, [cartItems, products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[5fr_2fr]">
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-xl p-4 sm:p-6 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-grow space-y-2 sm:space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-full sm:w-24 h-8 bg-gray-200 rounded mt-2 sm:mt-0"></div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[700px] px-4 bg-gradient-to-b from-gray-50 to-white text-center">
        <FaShoppingCart size={60} className="text-pink-200 mb-4 sm:mb-6" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-4 sm:mb-6">
          Looks like you haven't added any items yet
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto max-w-xs"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <Title text1="MY " text2="CART" />
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[5fr_2fr]">
        <div className="space-y-4 sm:space-y-6">
          {cartData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img
                className="w-full sm:w-24 h-48 sm:h-24 object-contain rounded-lg max-w-xs"
                src={item.productData.image[0]}
                alt={item.productData.name}
              />

              <div className="flex-grow w-full text-center sm:text-left">
                <h3 className="font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  {item.productData.name}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                  <p className="text-pink-600 font-bold">
                    {currency} {item.productData.price.toFixed(2)}
                  </p>
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    {item.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-normal w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                <input
                  className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  aria-label="Remove item"
                >
                  <FaRegTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-first lg:order-none mb-6 lg:mb-0">
          <CartSummary />
          <button
            onClick={() => navigate("/place-order")}
            className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 sm:py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
