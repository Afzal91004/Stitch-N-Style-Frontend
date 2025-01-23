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
    <div
      className="
        fixed 
        inset-0 
        z-50 
        bg-white/95 
        backdrop-blur-sm 
        overflow-hidden
      "
    >
      <div
        className="
          container 
          mx-auto 
          px-4 
          py-4 
          h-full 
          flex 
          items-start 
          justify-center 
          pt-20 
          md:pt-32
        "
      >
        <div
          className="
            w-full 
            max-w-xl 
            relative 
            animate-fade-in
          "
        >
          <div
            className={`
              flex 
              items-center 
              border-2 
              rounded-full 
              px-4 
              py-3 
              bg-white 
              shadow-lg 
              transition-all 
              duration-300
              ${
                isFocused
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
          >
            <FaSearch
              size={20}
              className={`
                mr-3 
                transition-colors 
                ${isFocused ? "text-blue-500" : "text-gray-400"}
              `}
            />

            <input
              ref={inputRef}
              className="
                flex-1 
                bg-transparent 
                outline-none 
                text-base 
                md:text-lg
                text-gray-800 
                placeholder-gray-500
                w-full
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
                className="
                  ml-2 
                  p-1.5 
                  rounded-full 
                  hover:bg-gray-100 
                  transition-colors 
                  group
                "
                aria-label="Clear search"
              >
                <RxCross2
                  size={20}
                  className="
                    text-gray-500 
                    group-hover:text-gray-700 
                    transition-colors
                  "
                />
              </button>
            )}

            <button
              onClick={handleSearch}
              className="
                ml-2 
                bg-blue-500 
                text-white 
                px-4 
                py-2 
                rounded-full 
                hover:bg-blue-600 
                transition-colors
                flex 
                items-center 
                gap-2
              "
            >
              <FaSearch />
              Search
            </button>
          </div>

          <button
            onClick={handleCloseSearch}
            className="
              absolute 
              -top-12 
              right-0 
              p-2 
              rounded-full 
              hover:bg-gray-100 
              group
              text-gray-600 
              hover:text-gray-900
            "
            aria-label="Close search"
          >
            <RxCross2 size={24} />
          </button>

          {!search && (
            <div
              className="
                mt-6 
                text-center 
                text-gray-500 
                text-sm 
                md:text-base 
                animate-fade-in
              "
            >
              Try searching for "Shirt", "Jacket", or "Accessories"
            </div>
          )}

          {searchResults.length > 0 && (
            <div
              className="
                mt-4 
                bg-white 
                border 
                rounded-lg 
                shadow-md 
                max-h-80 
                overflow-y-auto 
                animate-fade-in
              "
            >
              {searchResults.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={() => setShowSearch(false)}
                  className="
                    flex 
                    items-center 
                    p-3 
                    hover:bg-gray-100 
                    transition-colors 
                    group
                  "
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="
                      w-12 
                      h-12 
                      object-cover 
                      rounded 
                      mr-4
                    "
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
          )}

          {search && searchResults.length === 0 && (
            <div
              className="
                mt-4 
                bg-white 
                border 
                rounded-lg 
                shadow-md 
                p-4 
                text-center 
                text-gray-500
                animate-fade-in
              "
            >
              No products found matching "{search}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
