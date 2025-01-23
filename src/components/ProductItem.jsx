import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, ChevronRight } from "lucide-react";

const ProductItem = ({ id, image, name, price, rating = 4.5 }) => {
  const { currency, addToCart } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={image[0]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* add to cart
        <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingCart size={18} className="text-gray-700" />
        </div> */}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                strokeWidth={1}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{rating}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
          {name}
        </h3>

        <p className="text-base font-bold text-black">
          {currency}
          {price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
