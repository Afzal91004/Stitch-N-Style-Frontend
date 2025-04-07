import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    filteredProducts,
    currency,
  } = useContext(ShopContext);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
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

  const handleSearch = () => {
    const results = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(results);
    setShowSearch(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearch("");
    setSearchResults([]);

    if (window.location.pathname === "/search-results") {
      navigate("/collection");
    }
  };

  const searchSuggestions = search
    ? filteredProducts.slice(0, 5).map((product) => ({
        id: product._id,
        name: product.name,
        image: product.image[0],
        price: product.price,
      }))
    : [];

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-white/95 to-pink-50/95 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex items-start justify-center pt-20 md:pt-32">
        <div className="w-full max-w-xl relative animate-fade-in scale-up-center">
          <div
            className={`
              flex items-center border-2 rounded-xl px-4 py-3 
              bg-white shadow-lg transition-all duration-300
              ${
                isFocused
                  ? "border-pink-500 ring-2 ring-pink-100 shadow-pink-100"
                  : "border-gray-200 hover:border-pink-300"
              }
            `}
          >
            <FaSearch
              size={20}
              className={`
                mr-3 transition-colors
                ${isFocused ? "text-pink-500" : "text-gray-400"}
              `}
            />

            <input
              ref={inputRef}
              className="
                flex-1 bg-transparent outline-none 
                text-base md:text-lg text-gray-800 
                placeholder-gray-500 w-full
              "
              type="text"
              placeholder="Search products, categories, and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />

            {search && (
              <button
                onClick={handleClearSearch}
                className="ml-2 p-1.5 rounded-full hover:bg-pink-50 transition-colors group"
                aria-label="Clear search"
              >
                <RxCross2
                  size={20}
                  className="text-gray-500 group-hover:text-pink-500 transition-colors"
                />
              </button>
            )}

            <button
              onClick={handleSearch}
              className="
                ml-2 bg-gradient-to-r from-pink-500 to-pink-600
                text-white px-4 py-2 rounded-lg 
                hover:shadow-md transition-all duration-300
                flex items-center gap-2
              "
            >
              <FaSearch size={14} />
              Search
            </button>
          </div>

          <button
            onClick={handleCloseSearch}
            className="
              absolute -top-12 right-0 p-2 
              rounded-full hover:bg-gray-100 
              text-gray-600 hover:text-pink-500
              transition-colors group
            "
            aria-label="Close search"
          >
            <RxCross2 size={24} />
          </button>

          {/* Search suggestions */}
          {!search && (
            <div className="mt-6 p-4 bg-white/50 rounded-xl border border-pink-100 backdrop-blur-sm">
              <p className="text-gray-600 text-center mb-2">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Shirts", "Dresses", "Jackets", "Accessories"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearch(term)}
                    className="px-3 py-1 rounded-full bg-white border border-pink-200 text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-white/80 rounded-xl border border-pink-100 shadow-lg backdrop-blur-sm">
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={() => setShowSearch(false)}
                  className="
                    flex items-center p-4 hover:bg-gray-50 
                    transition-colors group border-b 
                    border-gray-100 last:border-none
                  "
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-grow">
                    <span className="text-gray-800 group-hover:text-pink-600 transition-colors block font-medium">
                      {product.name}
                    </span>
                    <span className="text-sm text-pink-500 font-semibold">
                      {currency}
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No results message */}
          {search && searchResults.length === 0 && (
            <div className="mt-4 bg-white/80 rounded-xl border border-pink-100 shadow-lg p-6 text-center backdrop-blur-sm">
              <p className="text-gray-600">
                No products found matching "{search}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
