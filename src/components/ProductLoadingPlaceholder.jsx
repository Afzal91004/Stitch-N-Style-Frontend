import React from "react";

const ProductLoadingPlaceholder = () => {
  return (
    <div className="block bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="relative overflow-hidden aspect-square bg-gray-200">
        {/* Image placeholder */}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {/* Rating placeholder */}
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>

        {/* Name placeholder */}
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

        {/* Price placeholder */}
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};

export default ProductLoadingPlaceholder;
