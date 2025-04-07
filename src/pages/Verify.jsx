import React, { useEffect, useState, useContext } from "react";
import { CheckCircle, XCircle, ShoppingBag, RefreshCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Verify = () => {
  const [animate, setAnimate] = useState(false);
  const [searchParams] = useSearchParams();
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);

  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success: success.toString(), orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setCartItems({});
      }
    } catch (error) {
      console.error("Payment verification error:", error);
    }
  };

  useEffect(() => {
    setAnimate(true);
    verifyPayment();
  }, []);

  const getContent = () => {
    return success
      ? {
          icon: (
            <CheckCircle
              size={80}
              className="text-green-500"
              strokeWidth={2.5}
            />
          ),
          title: "Payment Verified",
          message: "Your transaction has been successfully processed",
          buttonText: "View My Orders",
          buttonAction: () => navigate("/orders"),
          buttonIcon: <ShoppingBag size={20} />,
        }
      : {
          icon: (
            <XCircle size={80} className="text-red-500" strokeWidth={2.5} />
          ),
          title: "Payment Failed",
          message: "Your transaction could not be completed",
          buttonText: "Try Again",
          buttonAction: () => navigate("/cart"),
          buttonIcon: <RefreshCcw size={20} />,
        };
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-pink-100 p-4">
      <div
        className={`relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-1000 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            success ? "from-gray-600 to-gray-700" : "from-red-500 to-orange-500"
          } rounded-lg transition-all duration-1000 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
          style={{ padding: "2px" }}
        >
          <div className="h-full w-full bg-white rounded-lg" />
        </div>

        <div className="relative flex flex-col items-center justify-center gap-6 p-8">
          <div
            className={`transform transition-all duration-1000 ${
              animate
                ? "scale-100 rotate-0 opacity-100"
                : "scale-50 -rotate-90 opacity-0"
            }`}
          >
            {content.icon}
          </div>

          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {content.title}
            </h2>
            <p className="text-gray-600 mb-8">{content.message}</p>
          </div>

          <button
            onClick={content.buttonAction}
            className={`flex items-center justify-center gap-2 px-8 py-3 
              bg-gray-600 hover:bg-gray-700
              text-white rounded-lg font-medium w-full max-w-xs mx-auto
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${
                animate
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
          >
            {content.buttonIcon}
            {content.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
