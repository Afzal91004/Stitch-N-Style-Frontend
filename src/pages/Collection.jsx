import React, { useContext, useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { filteredProducts, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleFilter = (currentFilters, setFilters, value) => {
    setFilters(
      currentFilters.includes(value)
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value]
    );
  };

  const applyFilter = () => {
    let filteredProductsList = filteredProducts.filter((item) => {
      const categoryMatch =
        category.length === 0 || category.includes(item.category);
      const subCategoryMatch =
        subCategory.length === 0 || subCategory.includes(item.subCategory);
      return categoryMatch && subCategoryMatch;
    });

    switch (sortType) {
      case "low-high":
        filteredProductsList.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filteredProductsList.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProducts(filteredProductsList);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, sortType, filteredProducts]);

  const renderCheckboxFilter = (items, onChange, selectedItems) =>
    items.map((item) => (
      <label
        key={item}
        className={`flex gap-2 items-center cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors ${
          selectedItems.includes(item) ? "bg-gray-100" : ""
        }`}
      >
        <input
          checked={selectedItems.includes(item)}
          onChange={(e) => onChange(e.target.value)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          value={item}
        />
        <span className="text-sm text-gray-700">{item}</span>
      </label>
    ));

  const CATEGORIES = ["Men", "Women", "Kids"];
  const SUB_CATEGORIES = ["Topwear", "Bottomwear", "Winterwear"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="lg:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md mb-4"
        >
          <FaFilter />
          <span>{showFilter ? "Hide" : "Show"} Filters</span>
        </button>

        <div
          className={`
          w-full lg:w-64 
          ${showFilter ? "block" : "hidden"} lg:block 
          transition-all duration-300 ease-in-out
        `}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                {renderCheckboxFilter(
                  CATEGORIES,
                  (value) => toggleFilter(category, setCategory, value),
                  category
                )}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Type</h3>
              <div className="space-y-2">
                {renderCheckboxFilter(
                  SUB_CATEGORIES,
                  (value) => toggleFilter(subCategory, setSubCategory, value),
                  subCategory
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {search && (
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <FaSearch />
              <span>
                {filterProducts.length} result
                {filterProducts.length !== 1 ? "s" : ""} for "{search}"
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

          {filterProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterProducts.map((item) => (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
