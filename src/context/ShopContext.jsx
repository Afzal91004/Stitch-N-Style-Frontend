import React, { createContext, useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const deliveryFee = 49;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // add to cart
  const addToCart = (itemId, size) => {
    console.log("Add to Cart Called");
    console.log("Item ID:", itemId);
    console.log("Size:", size);

    // Check if size is defined and not an empty string
    if (!size || size.trim() === "") {
      console.error("Size is not selected");

      // Try multiple toast methods
      try {
        toast.error("Please Select a Size", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (toastError) {
        console.error("Toast error:", toastError);
      }

      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  // cart count
  // const getCartCount = () => {
  //   let totalCount = 0;
  //   for (const items in cartItems) {
  //     for (const item in cartItems[items]) {
  //       try {
  //         if (cartItems[items][item] > 0) {
  //           totalCount += cartItems[items][item];
  //         }
  //       } catch (error) {}
  //     }
  //   }
  //   return totalCount;
  // };
  const getCartCount = () => {
    console.log("Current cart items:", cartItems);

    try {
      if (Object.keys(cartItems).length === 0) {
        return 0;
      }

      const totalCount = Object.values(cartItems).reduce((total, sizes) => {
        if (typeof sizes !== "object") {
          console.warn("Unexpected cart item structure:", sizes);
          return total;
        }

        return (
          total +
          Object.values(sizes).reduce((sizeTotal, count) => {
            // Ensure count is a number
            const numCount = Number(count);
            return sizeTotal + (isNaN(numCount) ? 0 : numCount);
          }, 0)
        );
      }, 0);

      console.log("Calculated cart count:", totalCount);
      return totalCount;
    } catch (error) {
      console.error("Error calculating cart count:", error);
      return 0;
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // search functionality
  const filteredProducts = useMemo(() => {
    if (!search) return products;

    const searchTerm = search.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.subCategory.toLowerCase().includes(searchTerm)
    );
  }, [search, products]);

  const getCartAmount = () => {
    let totalAmount = 0;

    // Iterate over each item in the cart
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);

      if (!itemInfo) {
        console.warn(`Product with ID ${itemId} not found in products list.`);
        continue; // Skip to the next item if the product is not found
      }

      const sizes = cartItems[itemId]; // Sizes object for the current item

      for (const size in sizes) {
        const quantity = sizes[size];

        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity; // Add to total amount
        }
      }
    }

    return totalAmount;
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const value = {
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
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
