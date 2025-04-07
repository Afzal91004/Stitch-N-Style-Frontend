import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  Eye,
  MapPin,
  CreditCard,
  ChevronRight,
  Check,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Truck,
  Package,
  Ruler,
  Scissors,
  Palette,
  Shirt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import axios from "axios";
import razorpayLogo from "../assets/frontend_assets/razorpay_logo.png";

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
      relative flex items-center justify-between gap-3 border-2 p-4 rounded-xl transition-all duration-300 group
      ${
        selectedMethod === method
          ? "border-indigo-500 bg-indigo-50 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
  >
    <div className="flex items-center gap-3">
      {selectedMethod === method && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1 shadow-md">
          <CheckCircle className="text-white" size={16} />
        </div>
      )}
      <div
        className={`
          w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center
          ${
            selectedMethod === method
              ? "bg-indigo-600 border-indigo-600"
              : "border-gray-300 group-hover:border-gray-400"
          }
        `}
      >
        {selectedMethod === method && (
          <Check size={12} className="text-white" />
        )}
      </div>
      {logo ? (
        <img
          className="h-6 w-auto max-w-[120px] object-contain"
          src={logo}
          alt={`${method} logo`}
        />
      ) : (
        <span className="text-gray-700 font-medium">{label}</span>
      )}
    </div>
    <ChevronRight
      size={18}
      className={`text-gray-400 ${
        selectedMethod === method ? "text-indigo-500" : ""
      }`}
    />
  </button>
);

const StatusPill = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-800",
      icon: <Clock size={14} className="mr-1" />,
      text: "Pending",
    },
    bid_received: {
      color: "bg-blue-100 text-blue-800",
      icon: <CreditCard size={14} className="mr-1" />,
      text: "Bid Received",
    },
    accepted: {
      color: "bg-blue-100 text-blue-800",
      icon: <CheckCircle size={14} className="mr-1" />,
      text: "Accepted",
    },
    waiting_payment: {
      color: "bg-orange-100 text-orange-800",
      icon: <CreditCard size={14} className="mr-1" />,
      text: "Payment Pending",
    },
    in_progress: {
      color: "bg-purple-100 text-purple-800",
      icon: <RefreshCw size={14} className="mr-1" />,
      text: "In Progress",
    },
    shipped: {
      color: "bg-indigo-100 text-indigo-800",
      icon: <Truck size={14} className="mr-1" />,
      text: "Shipped",
    },
    delivered: {
      color: "bg-emerald-100 text-emerald-800",
      icon: <Package size={14} className="mr-1" />,
      text: "Delivered",
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle size={14} className="mr-1" />,
      text: "Completed",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: <X size={14} className="mr-1" />,
      text: "Cancelled",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.color} flex items-center font-medium`}>
      {config.icon}
      {config.text}
    </Badge>
  );
};

const ProgressStepper = ({ status }) => {
  const steps = [
    { id: "pending", label: "Order Placed" },
    { id: "accepted", label: "Accepted" },
    { id: "waiting_payment", label: "Payment" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 z-0"></div>
        <div
          className="absolute top-3 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 z-10 transition-all duration-500"
          style={{
            width: `${(activeIndex / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between z-20">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  index <= activeIndex
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-gray-300"
                }`}
              >
                {index <= activeIndex ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <span className="text-xs text-gray-500">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center ${
                  index <= activeIndex
                    ? "text-indigo-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onViewDetails, onAcceptBid }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const truncatedId = order._id.slice(-6);

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Left column with image */}
        {order.referenceImages && order.referenceImages[0] && (
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-full">
              <img
                className="w-full h-full object-contain"
                src={order.referenceImages[0]}
                alt="Custom design reference"
              />
              <div className="absolute top-3 left-3">
                <StatusPill status={order.status} />
              </div>
            </div>
          </div>
        )}

        {/* Right column with content */}
        <div className="flex-1 p-6">
          {/* Header section */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Order #{truncatedId}
                </h3>
                {order.price && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                    ₹{order.price}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">Placed on {formattedDate}</p>
            </div>

            <Button
              onClick={() => onViewDetails(order)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Eye size={16} />
              View Details
            </Button>
          </div>

          {/* Design details section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Shirt size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Style</p>
                <p className="font-medium text-gray-800">
                  {order.design.style}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Scissors size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fabric</p>
                <p className="font-medium text-gray-800">
                  {order.design.fabric}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Palette size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium text-gray-800">
                  {order.design.color}
                </p>
              </div>
            </div>
          </div>

          {/* Progress section */}
          <ProgressStepper status={order.status} />

          {/* Action section */}
          {order.status === "pending" && order.price && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <p className="text-sm font-medium text-blue-800">
                    Designer's Bid: ₹{order.price}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Accept this quote to proceed with your order
                  </p>
                </div>
                <Button
                  onClick={() => onAcceptBid(order)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Accept Bid
                </Button>
              </div>
            </div>
          )}

          {order.status === "accepted" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <p className="text-sm font-medium text-green-800">
                    Order Accepted
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Complete the payment to proceed with your order
                  </p>
                </div>
                <Button
                  onClick={() => onViewDetails(order)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcceptingBid, setIsAcceptingBid] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phoneNumber: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [processingOrder, setProcessingOrder] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  const navigate = useNavigate();

  const paymentMethods = [
    {
      method: "razorpay",
      logo: razorpayLogo,
      endpoint: "/razorpay",
    },
    // {
    //   method: "cod",
    //   label: "CASH ON DELIVERY",
    //   endpoint: "/:orderId/confirm-cod",
    // },
  ];

  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsRazorpayLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpay();

    return () => {
      const script = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-order`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch your orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-order/update-status`,
        {
          orderId: orderId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        return true;
      } else {
        console.error("Failed to update order status:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  };

  const processRazorpayPayment = async (orderResponse) => {
    if (!isRazorpayLoaded || !window.Razorpay) {
      toast.error("Payment gateway is not loaded. Please try again.");
      return false;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderResponse.order.amount,
      currency: "INR",
      name: "Stitch N Style",
      description: `Custom Order #${orderResponse.orderId.slice(-6)}`,
      order_id: orderResponse.order.id,
      handler: async function (response) {
        try {
          console.log("Payment successful, starting verification...", {
            customOrderId: orderResponse.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          const verificationResponse = await axios.post(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/custom-order/verify-razorpay`,
            {
              orderId: orderResponse.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (
            verificationResponse.data.success ||
            !verificationResponse.data.status.success
          ) {
            const statusUpdated = await updateOrderStatus(
              orderResponse.orderId,
              "in_progress"
            );

            if (statusUpdated) {
              toast.success(
                "Payment verified successfully! Your order is now in progress.",
                {
                  icon: <CheckCircle className="text-green-500" />,
                }
              );
            } else {
              toast.success(
                "Payment verified! There was an issue updating the order status, but your payment was successful.",
                {
                  icon: <CheckCircle className="text-green-500" />,
                }
              );
            }

            fetchOrders();
            setIsPaymentModalOpen(false);
            setIsModalOpen(false);
          } else {
            toast.error(
              verificationResponse.data.message ||
                "Payment verification failed",
              {
                icon: <X className="text-red-500" />,
              }
            );
          }
        } catch (error) {
          console.error("Verification error:", error);

          let errorMessage = "Payment verification failed. Please try again.";
          if (error.response) {
            if (error.response.status === 404) {
              errorMessage = "Endpoint not found. Please contact support.";
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
          }

          toast.error(errorMessage, {
            icon: <X className="text-red-500" />,
          });
        }
      },
      modal: {
        ondismiss: function () {
          toast.warning("Payment window was closed before completion.", {
            icon: <AlertCircle className="text-yellow-500" />,
          });
        },
      },
      theme: {
        color: "#4f46e5",
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      return true;
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment window. Please try again.", {
        icon: <X className="text-red-500" />,
      });
      return false;
    }
  };

  const handleAcceptBid = async () => {
    try {
      setCheckoutError("");
      setProcessingOrder(true);

      const requiredFields = [
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "phoneNumber",
      ];
      const missingFields = requiredFields.filter(
        (field) => !shippingAddress[field]
      );

      if (missingFields.length > 0) {
        setCheckoutError(
          "Please fill all required fields in the shipping address"
        );
        setProcessingOrder(false);
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(shippingAddress.phoneNumber)) {
        setCheckoutError("Please enter a valid 10-digit phone number");
        setProcessingOrder(false);
        return;
      }

      const token = localStorage.getItem("token");

      const acceptResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/custom-order/accept-bid`,
        {
          orderId: selectedOrder._id,
          shippingAddress: shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!acceptResponse.data.success) {
        throw new Error(acceptResponse.data.message || "Failed to accept bid");
      }

      if (paymentMethod) {
        const selectedPayment = paymentMethods.find(
          (pm) => pm.method === paymentMethod
        );

        const paymentResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}${selectedPayment.endpoint}`,
          {
            orderId: selectedOrder._id,
            amount: selectedOrder.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (paymentMethod === "razorpay") {
          await processRazorpayPayment(paymentResponse.data);
        } else if (paymentMethod === "cod") {
          const statusUpdated = await updateOrderStatus(
            selectedOrder._id,
            "in_progress"
          );

          if (statusUpdated) {
            setCheckoutSuccess(
              "Order placed successfully! Your order is now in progress."
            );
          } else {
            setCheckoutSuccess("Order placed successfully!");
          }

          setTimeout(() => {
            fetchOrders();
            setIsPaymentModalOpen(false);
            setIsModalOpen(false);
          }, 1500);
        }
      } else {
        setCheckoutSuccess("Bid accepted successfully!");
        setTimeout(() => {
          fetchOrders();
          setIsAcceptingBid(false);
          setIsModalOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      setCheckoutError(
        error.message || "Failed to place order. Please try again."
      );
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleProceedToPayment = () => {
    setIsAcceptingBid(false);
    setIsPaymentModalOpen(true);
  };

  const handleMakePayment = async (orderId) => {
    try {
      setCheckoutError("");
      setProcessingOrder(true);

      if (!paymentMethod) {
        toast.error("Please select a payment method", {
          icon: <CreditCard className="text-red-500" />,
        });
        setProcessingOrder(false);
        return;
      }

      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const payload = {
        orderId: selectedOrder._id,
        amount: selectedOrder.price,
      };

      let paymentResponse;

      if (paymentMethod === "razorpay") {
        paymentResponse = await axios.post(
          `${backendUrl}/api/custom-order/razorpay`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        await processRazorpayPayment(paymentResponse.data);
      } else if (paymentMethod === "cod") {
        paymentResponse = await axios.post(
          `${backendUrl}/api/custom-order/${orderId}/confirm-cod`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const statusUpdated = await updateOrderStatus(
          selectedOrder._id,
          "in_progress"
        );

        if (statusUpdated) {
          toast.success(
            "Order placed successfully! Your order is now in progress.",
            {
              icon: <CheckCircle className="text-green-500" />,
            }
          );
        } else {
          toast.success("Order placed successfully!", {
            icon: <CheckCircle className="text-green-500" />,
          });
        }

        setTimeout(() => {
          fetchOrders();
          setIsPaymentModalOpen(false);
          setIsModalOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process payment. Please try again."
      );
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/custom-order/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      fetchOrders();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError(error.message || "Failed to cancel order. Please try again.");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setIsAcceptingBid(false);
  };

  const handleAcceptBidClick = (order) => {
    setSelectedOrder(order);
    setIsAcceptingBid(true);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
            <p className="text-gray-600 mt-1">
              View and manage your custom clothing orders
            </p>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center border border-red-200">
            <AlertCircle size={20} className="mr-3" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 size={40} className="animate-spin text-indigo-600" />
              <span className="text-indigo-700 font-medium">
                Loading your orders...
              </span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Custom Orders Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any custom orders yet. Create your first
                custom clothing piece tailored just for you.
              </p>
              <Button
                onClick={() => navigate("/custom-cloth")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create Custom Order
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={handleViewDetails}
                onAcceptBid={handleAcceptBidClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen &&
        selectedOrder &&
        !isAcceptingBid &&
        !isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200">
              <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    Order #{selectedOrder._id.slice(-6)}
                    <StatusPill status={selectedOrder.status} />
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h3 className="font-semibold mb-4 text-gray-800">
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">
                            {selectedOrder._id}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Date Placed:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedOrder.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedOrder.price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium">
                              ₹{selectedOrder.price}
                            </span>
                          </div>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Est. Delivery:
                            </span>
                            <span className="font-medium">
                              {new Date(
                                selectedOrder.estimatedDelivery
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {selectedOrder.status === "pending" &&
                        selectedOrder.price && (
                          <div className="mt-6">
                            <Button
                              onClick={() => {
                                setIsAcceptingBid(true);
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Check size={14} className="mr-1" />
                              Accept Bid & Proceed
                            </Button>
                          </div>
                        )}

                      {selectedOrder.status === "accepted" && (
                        <div className="mt-6">
                          <Button
                            onClick={() => {
                              setIsPaymentModalOpen(true);
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                          >
                            <CreditCard size={14} className="mr-1" />
                            Proceed to Payment
                          </Button>
                        </div>
                      )}

                      {selectedOrder.tracking && (
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-6">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Truck size={18} className="text-indigo-600" />
                            Shipping Information
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Carrier:</span>
                              <span className="font-medium">
                                {selectedOrder.tracking.carrier}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Tracking Number:
                              </span>
                              <span className="font-medium">
                                {selectedOrder.tracking.number}
                              </span>
                            </div>
                            {selectedOrder.shippedAt && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Shipped Date:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    selectedOrder.shippedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {selectedOrder.deliveredAt && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Delivered Date:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    selectedOrder.deliveredAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                      <h3 className="font-semibold mb-4 text-gray-800">
                        Order Status
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Current Status
                          </p>
                          <StatusPill status={selectedOrder.status} />
                        </div>
                        <ProgressStepper status={selectedOrder.status} />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                          <Shirt size={18} className="text-indigo-600" />
                          Design Details
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(selectedOrder.design).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-sm"
                              >
                                <span className="capitalize text-gray-600">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                          <Ruler size={18} className="text-indigo-600" />
                          Measurements
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(selectedOrder.measurements).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-sm"
                              >
                                <span className="capitalize text-gray-600">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                <span className="font-medium">
                                  {value} inches
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedOrder.referenceImages?.length > 0 && (
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-800">
                          Reference Images
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {selectedOrder.referenceImages.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                            >
                              <img
                                src={image}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedOrder.designerNotes && (
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-semibold mb-3 text-gray-800">
                          Designer Notes
                        </h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {selectedOrder.designerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>

                  {selectedOrder.status === "completed" && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle size={14} className="mr-1" />
                      Leave Review
                    </Button>
                  )}

                  {selectedOrder.status === "pending" && (
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                    >
                      <X size={14} className="mr-1" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Accept Bid Modal */}
      {isModalOpen && selectedOrder && isAcceptingBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <div>
                <h2 className="text-xl font-bold">Complete Your Order</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Order #{selectedOrder._id.slice(-6)} - Price: ₹
                  {selectedOrder.price}
                </p>
              </div>
              <button
                onClick={() => setIsAcceptingBid(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {checkoutError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                  <AlertCircle
                    size={18}
                    className="mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{checkoutError}</p>
                  </div>
                </div>
              )}

              {checkoutSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                  <CheckCircle
                    size={18}
                    className="mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Success</p>
                    <p className="text-sm">{checkoutSuccess}</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-indigo-600" />
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="addressLine1"
                          value={shippingAddress.addressLine1}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="House No., Building Name"
                          required
                        />
                        <MapPin
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500"
                          size={18}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Apartment, Street, Locality"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province*
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN/Postal Code*
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number*
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={shippingAddress.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="10-digit mobile number"
                          required
                        />
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500"
                          size={18}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-600" />
                    Payment Method
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {paymentMethods.map(
                      ({ method: methodItem, logo, label }) => (
                        <PaymentMethodButton
                          key={methodItem}
                          method={methodItem}
                          selectedMethod={paymentMethod}
                          logo={logo}
                          label={label}
                          onClick={() => setPaymentMethod(methodItem)}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="font-semibold mb-4 text-gray-800">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Design:</span>
                      <span className="font-medium">
                        {selectedOrder.design.style}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fabric:</span>
                      <span className="font-medium">
                        {selectedOrder.design.fabric}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium">
                        {selectedOrder.design.color}
                      </span>
                    </div>

                    <div className="border-t my-3 pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span className="text-lg text-indigo-600">
                          ₹{selectedOrder.price}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        (Includes all taxes and shipping charges)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsAcceptingBid(false)}
                  disabled={processingOrder}
                >
                  Back
                </Button>

                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 min-w-[180px]"
                  onClick={handleAcceptBid}
                  disabled={processingOrder}
                >
                  {processingOrder ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      {paymentMethod === "razorpay"
                        ? `Pay ₹${selectedOrder.price}`
                        : "Place Order"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl border border-gray-200">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
              <div>
                <h2 className="text-xl font-bold">Complete Payment</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Order #{selectedOrder._id.slice(-6)} - Amount: ₹
                  {selectedOrder.price}
                </p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {checkoutError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                  <AlertCircle
                    size={18}
                    className="mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{checkoutError}</p>
                  </div>
                </div>
              )}

              {checkoutSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                  <CheckCircle
                    size={18}
                    className="mr-3 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Success</p>
                    <p className="text-sm">{checkoutSuccess}</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-indigo-600" />
                    Select Payment Method
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {paymentMethods.map(
                      ({ method: methodItem, logo, label }) => (
                        <PaymentMethodButton
                          key={methodItem}
                          method={methodItem}
                          selectedMethod={paymentMethod}
                          logo={logo}
                          label={label}
                          onClick={() => setPaymentMethod(methodItem)}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="font-semibold mb-4 text-gray-800">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <StatusPill status={selectedOrder.status} />
                    </div>
                    <div className="border-t my-3 pt-3">
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span className="text-lg text-indigo-600">
                          ₹{selectedOrder.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setIsModalOpen(true);
                  }}
                  disabled={processingOrder}
                >
                  Back
                </Button>

                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 min-w-[180px]"
                  onClick={() => handleMakePayment(selectedOrder._id)}
                  disabled={processingOrder || !paymentMethod}
                >
                  {processingOrder ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} className="mr-2" />
                      {paymentMethod === "razorpay"
                        ? `Pay ₹${selectedOrder.price}`
                        : "Place Order"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrderHistory;
