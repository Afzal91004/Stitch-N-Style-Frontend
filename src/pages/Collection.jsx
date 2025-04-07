import React, { useContext, useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import ProductLoadingPlaceholder from "../components/ProductLoadingPlaceholder";

const Collection = () => {
  const { filteredProducts, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [loading, setLoading] = useState(true);

  // Better named function for clarity
  const toggleFilterItem = (value, currentFilters, setFilters) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter((item) => item !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  // Apply filters and sorting to the products from context
  const applyFiltersAndSort = () => {
    // Start with all products from context
    let result = [...filteredProducts];

    // Apply category filter if any categories are selected
    if (category.length > 0) {
      result = result.filter((item) => category.includes(item.category));
    }

    // Apply subcategory filter if any subcategories are selected
    if (subCategory.length > 0) {
      result = result.filter((item) => subCategory.includes(item.subCategory));
    }

    // Apply sorting
    switch (sortType) {
      case "low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // For "relevant", we keep the original order
        break;
    }

    setDisplayProducts(result);
  };

  // Apply filters whenever any filter option changes or products change
  useEffect(() => {
    setLoading(true);
    applyFiltersAndSort();
    // Simulate loading delay for smooth transition
    setTimeout(() => setLoading(false), 500);
  }, [category, subCategory, sortType, filteredProducts]);

  const renderCheckboxFilter = (items, selectedItems, handleToggle) =>
    items.map((item) => (
      <label
        key={item}
        className={`flex gap-2 items-center cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors ${
          selectedItems.includes(item) ? "bg-gray-100" : ""
        }`}
      >
        <input
          checked={selectedItems.includes(item)}
          onChange={() => handleToggle(item, selectedItems)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          value={item}
        />
        <span className="text-sm text-gray-700">{item}</span>
      </label>
    ));

  const CATEGORIES = ["Men", "Women", "Kids"];
  const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];

  // Clear all filters
  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            <FaFilter />
            <span>{showFilter ? "Hide" : "Show"} Filters</span>
          </button>

          <div
            className={`w-full lg:w-64 ${
              showFilter ? "block" : "hidden"
            } lg:block transition-all duration-300 ease-in-out`}
          >
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  Clear All
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 relative inline-block">
                  Categories
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-transparent"></div>
                </h3>
                <div className="space-y-2 mt-4">
                  {renderCheckboxFilter(CATEGORIES, category, (item) =>
                    toggleFilterItem(item, category, setCategory)
                  )}
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 relative inline-block">
                  Type
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 to-transparent"></div>
                </h3>
                <div className="space-y-2 mt-4">
                  {renderCheckboxFilter(SUB_CATEGORIES, subCategory, (item) =>
                    toggleFilterItem(item, subCategory, setSubCategory)
                  )}
                </div>
              </div>

              <div className="pt-6">
                <p className="text-sm text-gray-600">
                  Active Filters: {category.length + subCategory.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {search && (
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <FaSearch />
                <span>
                  {displayProducts.length} result
                  {displayProducts.length !== 1 ? "s" : ""} for "{search}"
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <Title text1="ALL" text2="COLLECTIONS" />
              <select
                className="mt-2 sm:mt-0 w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <ProductLoadingPlaceholder key={`placeholder-${index}`} />
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                {search
                  ? `No products found matching "${search}"`
                  : "No products found matching your filters."}
                <button
                  onClick={clearFilters}
                  className="block mx-auto mt-4 text-pink-600 hover:text-pink-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
