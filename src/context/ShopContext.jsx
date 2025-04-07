import React, { createContext, useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const deliveryFee = 49;
  // Make sure this is correctly set in your .env file
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "https://stitch-n-style-backend.vercel.app";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const navigate = useNavigate();

  // Create an axios instance with proper configuration
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: backendUrl,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Set token if available
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return instance;
  }, [backendUrl, token]);

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error);

        // Detailed error logging for easier debugging
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }

        if (error.response?.status === 401) {
          handleLogout();
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [api]);

  useEffect(() => {
    if (token) {
      syncCart();
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const syncCart = async () => {
    if (!token) return;

    try {
      setCartLoading(true);
      const response = await api.get("/api/cart/get");
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Cart sync error:", error);
      // Don't show toast here as it might be annoying on initial load
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!size?.trim()) {
      toast.error("Please select a size");
      return;
    }

    setCartLoading(true);
    try {
      const response = await api.post("/api/cart/add", {
        itemId,
        size,
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
        // toast.success("Item added to cart");
      } else {
        throw new Error(response.data.message || "Failed to add item");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add item to cart");
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) return;

    setCartLoading(true);
    try {
      const response = await api.post("/api/cart/update", {
        itemId,
        size,
        quantity,
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update cart");
    } finally {
      setCartLoading(false);
    }
  };

  const getCartCount = () => {
    try {
      if (!cartItems || Object.keys(cartItems).length === 0) return 0;

      return Object.values(cartItems).reduce((total, sizes) => {
        if (!sizes || typeof sizes !== "object") return total;
        return (
          total +
          Object.values(sizes).reduce((sizeTotal, count) => {
            const numCount = Number(count);
            return sizeTotal + (isNaN(numCount) ? 0 : numCount);
          }, 0)
        );
      }, 0);
    } catch (error) {
      console.error("Error calculating cart count:", error);
      return 0;
    }
  };

  const getCartAmount = () => {
    try {
      return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
        const itemInfo = products.find((product) => product._id === itemId);
        if (!itemInfo) return total;
        return (
          total +
          Object.values(sizes).reduce(
            (itemTotal, quantity) => itemTotal + itemInfo.price * quantity,
            0
          )
        );
      }, 0);
    } catch (error) {
      console.error("Error calculating cart amount:", error);
      return 0;
    }
  };

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const searchTerm = search.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subCategory?.toLowerCase().includes(searchTerm)
    );
  }, [search, products]);

  const handleLogout = () => {
    setToken("");
    setCartItems({});
    navigate("/login");
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const getProductsData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/product/list");
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error("Error loading products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    setCartLoading(true);
    try {
      const response = await api.post("/api/cart/clear");
      if (response.data.success) {
        setCartItems({});
      } else {
        throw new Error(response.data.message || "Failed to clear cart");
      }
    } catch (error) {
      toast.error(error.message || "Failed to clear cart");
    } finally {
      setCartLoading(false);
    }
  };

  const contextValue = {
    products,
    filteredProducts,
    currency,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    loading,
    cartLoading,
    clearCart,
    logout: handleLogout,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
