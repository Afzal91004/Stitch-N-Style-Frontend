import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, currency } = useContext(
    ShopContext
  );
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState({
    products: [],
    designers: [],
  });
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && showSearch) {
        handleCloseSearch();
      }
    };

    if (showSearch) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showSearch, setShowSearch]);

  const handleSearch = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${backendUrl}/api/search`, {
        query: search,
      });
      if (response.data.success) {
        setSearchResults({
          products: response.data.products,
          designers: response.data.designers,
        });
      } else {
        setSearchResults({ products: [], designers: [] });
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults({ products: [], designers: [] });
    inputRef.current?.focus();
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearch("");
    setSearchResults({ products: [], designers: [] });

    if (window.location.pathname === "/search-results") {
      navigate("/collection");
    }
  };

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex items-start justify-center pt-20 md:pt-32">
        <div className="w-full max-w-5xl relative animate-fade-in">
          {/* Search Input Section */}
          <div
            className={`flex items-center border-2 rounded-full px-4 py-3 bg-white shadow-lg transition-all duration-300 ${
              isFocused
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FaSearch
              size={20}
              className={`mr-3 transition-colors ${
                isFocused ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-base md:text-lg text-gray-800 placeholder-gray-500"
              type="text"
              placeholder="Search products, designers, and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="ml-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                aria-label="Clear search"
              >
                <RxCross2
                  size={20}
                  className="text-gray-500 group-hover:text-gray-700 transition-colors"
                />
              </button>
            )}
            <button
              onClick={handleSearch}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleCloseSearch}
            className="absolute -top-12 right-0 p-2 rounded-full hover:bg-gray-100 group text-gray-600 hover:text-gray-900"
            aria-label="Close search"
          >
            <RxCross2 size={24} />
          </button>

          {/* Results Section */}
          <div className="mt-4 flex gap-6">
            {/* Products Section */}
            {searchResults.products.length > 0 && (
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold">Products</h3>
                <div className="bg-white border rounded-lg shadow-md max-h-80 overflow-y-auto animate-fade-in">
                  {searchResults.products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center p-3 hover:bg-gray-100 transition-colors group"
                    >
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div className="flex-grow">
                        <span className="text-gray-800 group-hover:text-blue-600 block">
                          {product.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {currency}
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Designers Section */}
            {searchResults.designers.length > 0 && (
              <div className="w-80">
                <h3 className="text-lg font-semibold">Designers</h3>
                <div className="bg-white border rounded-lg shadow-md max-h-80 overflow-y-auto animate-fade-in">
                  {searchResults.designers.map((designer) => (
                    <Link
                      key={designer._id}
                      to={`/designer-profile/${designer._id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center p-3 hover:bg-gray-100 transition-colors group"
                    >
                      <img
                        src={designer.profileImage || "/default-avatar.png"}
                        alt={designer.name}
                        className="w-12 h-12 object-cover rounded-full mr-4"
                      />
                      <div className="flex-grow">
                        <span className="text-gray-800 group-hover:text-blue-600 block">
                          {designer.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {designer.bio || "Designer"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* No Results Found Message */}
          {search &&
            searchResults.products.length === 0 &&
            searchResults.designers.length === 0 && (
              <div className="mt-4 bg-white border rounded-lg shadow-md p-4 text-center text-gray-500 animate-fade-in">
                No results found for "{search}"
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
