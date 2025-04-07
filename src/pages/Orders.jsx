import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Package, Truck, MapPin, Clock, CreditCard, Check } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const DeliveryStatusBar = ({ currentStatus }) => {
  const stages = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  const getStageIndex = (status) => stages.indexOf(status);
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="w-full py-4">
      {/* For larger screens - horizontal status bar */}
      <div className="hidden sm:flex justify-between mb-2">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center w-1/5">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center mb-2
              ${
                index <= currentIndex
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
            >
              {index <= currentIndex ? <Check size={16} /> : index + 1}
            </div>
            <div className="text-xs text-center text-gray-600">{stage}</div>
          </div>
        ))}
      </div>

      {/* For mobile - vertical status bar */}
      <div className="sm:hidden space-y-3">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center mr-3
              ${
                index <= currentIndex
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
            >
              {index <= currentIndex ? <Check size={16} /> : index + 1}
            </div>
            <div className="text-sm text-gray-600">{stage}</div>
            {index < stages.length - 1 && (
              <div className="h-6 w-0.5 bg-gray-200 absolute ml-4 mt-8"></div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar - visible on all screens */}
      <div className="relative w-full h-2 bg-gray-200 rounded sm:block hidden">
        <div
          className="absolute h-2 bg-pink-600 rounded transition-all duration-500"
          style={{
            width: `${(currentIndex / (stages.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed": {
      color: "bg-purple-100 text-purple-800",
      icon: Package,
    },
    Packing: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    Shipped: {
      color: "bg-green-100 text-green-800",
      icon: Truck,
    },
    "Out for delivery": {
      color: "bg-blue-100 text-blue-800",
      icon: Truck,
    },
    Delivered: {
      color: "bg-green-100 text-green-800",
      icon: Package,
    },
  };

  const { color, icon: StatusIcon } =
    statusConfig[status] || statusConfig["Order Placed"];

  return (
    <div
      className={`flex items-center gap-1 ${color} px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm whitespace-nowrap`}
    >
      <StatusIcon size={14} />
      <span className="hidden xs:inline">{status}</span>
    </div>
  );
};

const OrderLoadingPlaceholder = () => (
  <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 sm:h-10 bg-gray-200 w-1/3 sm:w-1/4 rounded"></div>
        <div className="h-3 sm:h-4 bg-gray-200 w-1/2 sm:w-1/3 rounded"></div>

        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="h-4 sm:h-5 bg-gray-200 w-3/4 rounded"></div>
                <div className="h-3 sm:h-4 bg-gray-200 w-1/4 rounded"></div>
                <div className="h-3 sm:h-4 bg-gray-200 w-1/2 rounded"></div>
              </div>
              <div className="w-full sm:w-32">
                <div className="h-6 sm:h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const ordersPerPage = 8;

  const loadOrderData = async () => {
    try {
      if (!token) {
        setError("Please login to view orders");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const processedOrders = response.data.orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            orderDate: new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            orderTime: new Date(order.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            amount: order.amount,
          }))
        );
        setOrderData(processedOrders.reverse());
        setDisplayedOrders(processedOrders.slice(0, page * ordersPerPage));
      }
    } catch (error) {
      setError("Error loading orders. Please try again later.");
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
      setIsTracking(false);
    }
  };

  const trackOrder = async (orderId) => {
    setIsTracking(true);
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    await loadOrderData();
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * ordersPerPage;
    setDisplayedOrders(orderData.slice(startIndex, endIndex));
    setPage(nextPage);
  };

  useEffect(() => {
    loadOrderData();
  }, [token, backendUrl]);

  if (isLoading) {
    return <OrderLoadingPlaceholder />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-12 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-pink-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              {/* left */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <Package className="text-pink-600" size={24} />
                  My Orders
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                  Track and manage your recent purchases
                </p>
              </div>
              {/* right */}
              <div className="w-full sm:w-auto">
                <Link
                  to="/custom-order-history"
                  className="block text-center sm:inline-block bg-pink-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  My Custom Orders
                </Link>
              </div>
            </div>
          </div>

          {orderData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found. Start shopping to see your orders here.
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {displayedOrders.map((item, index) => (
                <div
                  key={`${item.orderId}-${item._id}-${index}`}
                  className="bg-white shadow-lg sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 transition-all hover:scale-[1.02] sm:hover:scale-105 duration-300"
                >
                  <div className="p-3 sm:p-6 flex flex-col gap-4">
                    {/* Mobile view header with status badge */}
                    <div className="flex justify-between items-center sm:hidden">
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.name}
                      </h2>
                      <OrderStatusBadge status={item.status} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0 w-full sm:w-1/4">
                        <img
                          className="w-full h-48 sm:h-36 object-cover rounded-lg shadow-sm transition-transform hover:scale-105"
                          src={item.image[0]}
                          alt={item.name}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-grow sm:w-1/2">
                        {/* Desktop view title - hidden on mobile */}
                        <h2 className="hidden sm:block text-xl font-semibold text-gray-800 mb-2">
                          {item.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-medium">
                              {currency}
                              {item.price}
                            </span>
                          </div>
                          <div className="h-4 border-r border-gray-300"></div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="h-4 border-r border-gray-300"></div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span>Size: {item.size}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <MapPin size={14} className="text-pink-500" />
                            <span className="truncate">
                              Order: {item.orderDate} at {item.orderTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <CreditCard size={14} className="text-pink-500" />
                            <span>{item.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Action */}
                      <div className="sm:w-1/4 flex flex-col items-center sm:items-end justify-between">
                        {/* Status badge - hidden on mobile */}
                        <div className="hidden sm:block">
                          <OrderStatusBadge status={item.status} />
                        </div>
                        <button
                          className={`mt-2 sm:mt-4 w-full bg-gray-600 text-white py-2 rounded-lg 
                            hover:bg-gray-700 transition-all duration-300 
                            flex items-center justify-center gap-2 transform hover:scale-105
                            text-sm sm:text-base
                            ${
                              isTracking ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          onClick={() => trackOrder(item.orderId)}
                          disabled={isTracking}
                        >
                          <Truck size={16} />
                          {isTracking ? "Tracking..." : "Track Order"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedOrder === item.orderId && (
                    <div className="px-3 sm:px-6 pb-3 sm:pb-6">
                      <DeliveryStatusBar currentStatus={item.status} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {displayedOrders.length < orderData.length && (
            <div className="mt-6 sm:mt-8 text-center">
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                onClick={loadMore}
              >
                View More Orders
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
