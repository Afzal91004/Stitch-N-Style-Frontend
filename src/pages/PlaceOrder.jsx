import React, { useContext, useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  X,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import CartSummary from "../components/CartSummary";
import { assets } from "../assets/frontend_assets/assets";
import { Toaster, toast } from "sonner";
import axios from "axios";

const PaymentMethodButton = ({
  method,
  selectedMethod,
  logo,
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      relative flex items-center justify-center gap-3 border-2 p-3 rounded-lg transition-all duration-300 group
      ${
        selectedMethod === method
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
  >
    {selectedMethod === method && (
      <CheckCircle
        className="absolute top-2 right-2 text-green-500"
        size={20}
      />
    )}
    <div
      className={`
        w-5 h-5 rounded-full border-2 transition-all
        ${
          selectedMethod === method
            ? "bg-green-500 border-green-500"
            : "border-gray-300 group-hover:border-gray-400"
        }
      `}
    />
    {logo ? (
      <img
        className="h-6 w-auto max-w-[120px] object-contain"
        src={logo}
        alt={`${method} logo`}
      />
    ) : (
      <span className="text-gray-700 font-medium">{label}</span>
    )}
  </button>
);

const PlaceOrder = () => {
  const [method, setMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    deliveryFee,
    products,
    clearCart,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phoneNumber: "",
  });

  const paymentMethods = [
    {
      method: "stripe",
      logo: assets.stripe_logo,
    },
    {
      method: "razorpay",
      logo: assets.razorpay_logo,
    },
    {
      method: "cod",
      label: "CASH ON DELIVERY",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodSelection = (selectedMethod) => {
    setMethod(selectedMethod);
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "streetAddress",
      "city",
      "state",
      "pinCode",
      "country",
      "phoneNumber",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all address fields", {
        description: `Missing fields: ${missingFields.join(", ")}`,
        icon: <X className="text-red-500" />,
      });
      return false;
    }

    if (!method) {
      toast.error("Please select a payment method", {
        icon: <CreditCard className="text-red-500" />,
      });
      return false;
    }

    return true;
  };

  const handleOrderSuccess = async () => {
    await clearCart();
    toast.success("Order placed successfully!", {
      description: "Your order has been confirmed.",
      icon: <CheckCircle className="text-green-500" />,
    });
    setTimeout(() => navigate("/orders"), 1500);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let orderItems = [];

      Object.entries(cartItems).forEach(([productId, sizes]) => {
        Object.entries(sizes).forEach(([size, quantity]) => {
          if (quantity > 0) {
            const itemInfo = products.find(
              (product) => product._id === productId
            );
            if (itemInfo) {
              orderItems.push({
                ...structuredClone(itemInfo),
                size: size,
                quantity: quantity,
              });
            }
          }
        });
      });

      let orderData = {
        items: orderItems,
        amount: getCartAmount() + deliveryFee,
        address: formData,
        paymentMethod: method,
      };

      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        await handleOrderSuccess();
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-12 bg-gray-50 min-h-screen">
      <Toaster position="top-right" richColors />

      <form onSubmit={onSubmitHandler} className="grid lg:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <MapPin className="text-pink-500" size={32} />
            <h2 className="text-3xl font-bold text-gray-800">
              Delivery Details
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-sm text-gray-600 mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter first name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <User
                  className="absolute left-3 top-[58px] -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                  size={20}
                />
              </div>
              <div className="relative group">
                <label className="block text-sm text-gray-600 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter last name"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <User
                  className="absolute left-3 top-[58px] -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                  size={20}
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm text-gray-600 mb-2">
                Email Address
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Enter email address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <Mail
                className="absolute left-3 top-[58px] -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                size={20}
              />
            </div>

            <div className="relative group">
              <label className="block text-sm text-gray-600 mb-2">
                Street Address
              </label>
              <input
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter street address"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <MapPin
                className="absolute left-3 top-[58px] -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                size={20}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter city"
                  className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter state"
                  className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Pin Code
                </label>
                <input
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter pin code"
                  className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Country
                </label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Enter country"
                  className="w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm text-gray-600 mb-2">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                type="tel"
                placeholder="Enter phone number"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <Phone
                className="absolute left-3 top-[58px] -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="space-y-8">
          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <ShoppingCart className="text-pink-500" size={32} />
              <h3 className="text-3xl font-bold text-gray-800">
                Order Summary
              </h3>
            </div>
            <CartSummary />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <CreditCard className="text-pink-500" size={32} />
              <h3 className="text-3xl font-bold text-gray-800">
                Payment Method
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {paymentMethods.map(({ method: methodItem, logo, label }) => (
                <PaymentMethodButton
                  key={methodItem}
                  method={methodItem}
                  selectedMethod={method}
                  logo={logo}
                  label={label}
                  onClick={() => handleMethodSelection(methodItem)}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !method}
              className={`
            w-full py-4 rounded-lg mt-8 text-lg font-semibold tracking-wide uppercase transition-all duration-300
            ${
              method && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
            >
              {isSubmitting
                ? "Processing..."
                : method
                ? "Proceed to Payment"
                : "Select Payment Method"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
