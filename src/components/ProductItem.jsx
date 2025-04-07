import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const ProductItem = ({
  id,
  image,
  name,
  price,
  rating = 4.5,
  loading = false,
}) => {
  const { currency } = useContext(ShopContext);

  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full">
        {/* Loader skeleton for image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
          </div>
        </div>

        {/* Loader skeleton for content */}
        <div className="p-4">
          {/* Rating skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
          </div>

          {/* Name skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>

          {/* Price skeleton */}
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image[0]}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{rating}</span>
        </div>

        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
          {name}
        </h3>

        <p className="text-base font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
          {currency}
          {price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
