import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FaRegTrashAlt, FaShoppingCart } from "react-icons/fa";
import CartSummary from "../components/CartSummary";
import ProductLoadingPlaceholder from "../components/ProductLoadingPlaceholder";

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
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[5fr_2fr]">
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-xl p-6 animate-pulse"
              >
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-grow space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white shadow-sm rounded-xl p-6 animate-pulse">
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
      <div className="flex flex-col items-center justify-center min-h-[700px] bg-gradient-to-b from-gray-50 to-white">
        <FaShoppingCart size={80} className="text-pink-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added any items yet
        </p>
        <button
          onClick={() => navigate("/collection")}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Title text1="MY " text2="CART" />
      </div>

      <div className="grid gap-8 md:grid-cols-[5fr_2fr]">
        <div className="space-y-6">
          {cartData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-xl p-6 flex items-center gap-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <img
                className="w-24 h-24 object-cover rounded-lg"
                src={item.productData.image[0]}
                alt={item.productData.name}
              />

              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 hover:text-pink-600 transition-colors">
                  {item.productData.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-pink-600 font-bold">
                    {currency} {item.productData.price.toFixed(2)}
                  </p>
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                    {item.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
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
                >
                  <FaRegTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <CartSummary />
          <button
            onClick={() => navigate("/place-order")}
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
