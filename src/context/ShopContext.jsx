import React, { createContext, useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const deliveryFee = 49;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (token) {
      syncCart();
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const syncCart = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/cart/get`);
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Cart sync error:", error);
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
      const response = await axios.post(`${backendUrl}/api/cart/add`, {
        itemId,
        size,
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
        toast.success("Item added to cart");
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
      const response = await axios.post(`${backendUrl}/api/cart/update`, {
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
  }, [backendUrl]);

  const getProductsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error(error.message || "Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;

    setCartLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/cart/clear`);
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
