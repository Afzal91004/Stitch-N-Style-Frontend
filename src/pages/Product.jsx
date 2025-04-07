import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  Star,
  ShoppingCart,
  ChevronRight,
  Heart,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import RelatedProducts from "../components/RelatedProducts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Product Loading Placeholder Component
const ProductLoadingPlaceholder = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl bg-gradient-to-br from-gray-50 to-pink-50">
      <div className="animate-pulse">
        {/* Breadcrumb placeholder */}
        <div className="flex items-center mb-8 pl-2">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="mx-2 h-3 w-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="mx-2 h-3 w-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 bg-gray-50 p-6 rounded-2xl shadow-sm">
          {/* Image placeholder */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="md:w-24 flex md:flex-col overflow-x-auto md:overflow-y-auto space-x-4 md:space-x-0 md:space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
            <div className="flex-grow">
              <div className="w-full max-w-[500px] h-[400px] bg-gray-200 rounded-xl mx-auto"></div>
            </div>
          </div>

          {/* Details placeholder */}
          <div className="space-y-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-gray-200 rounded-full"
                    ></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 ml-2"></div>
              </div>
            </div>

            <div className="h-10 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            <div className="mb-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-10 bg-gray-200 rounded-md"
                  ></div>
                ))}
              </div>
            </div>

            <div className="w-full h-12 bg-gray-200 rounded-lg"></div>

            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description placeholder */}
        <div className="mt-16">
          <div className="border-b mb-6">
            <div className="pb-2 h-6 bg-gray-200 rounded w-24 inline-block"></div>
            <div className="pb-2 ml-6 h-6 bg-gray-200 rounded w-32 inline-block"></div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="pl-5 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const rating = 4.5;

  useEffect(() => {
    setLoading(true);
    if (products && products.length > 0) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image[0]);
        if (product.sizes && product.sizes.length > 0) {
          setSize(product.sizes[0]);
        }
        setLoading(false);
      }
    }
  }, [productId, products]);

  if (loading || !productData) {
    return <ProductLoadingPlaceholder />;
  }

  const handleAddToCart = () => {
    if (!size && productData.sizes && productData.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    console.log("Button clicked");
    console.log("Current size:", size);
    addToCart(productData._id, size);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl bg-gradient-to-br from-gray-50 to-pink-50">
      <ToastContainer position="top-right" autoClose={2000} />
      <nav className="flex items-center text-xs text-gray-600 mb-8 pl-2">
        <a href="/shop" className="hover:text-gray-600 transition-colors">
          Shop
        </a>
        <ChevronRight size={14} className="mx-2 text-gray-400" />
        <a
          href={`/category/${productData.category}`}
          className="hover:text-gray-600 transition-colors"
        >
          {productData.category}
        </a>
        <ChevronRight size={14} className="mx-2 text-gray-400" />
        <span className="font-semibold text-gray-900">{productData.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 bg-gray-50 p-6 rounded-2xl shadow-sm">
        {/* Product Images */}
        <div className="flex flex-col-reverse md:flex-row gap-6">
          <div className="md:w-24 flex md:flex-col overflow-x-auto md:overflow-y-auto space-x-4 md:space-x-0 md:space-y-4">
            {productData.image.map((item, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setImage(item)}
              >
                <img
                  src={item}
                  className={`
                    w-20 h-20 object-cover rounded-lg transition-all duration-300
                    ${
                      image === item
                        ? " shadow-md scale-105"
                        : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
                    }
                  `}
                  alt={`Product thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <div className="flex-grow relative">
            <img
              src={image}
              alt={productData.name}
              className="w-full max-w-[500px] h-auto object-cover rounded-xl shadow-lg mx-auto"
            />
            <button
              onClick={() => setFavorite(!favorite)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
            >
              <Heart
                size={24}
                fill={favorite ? "red" : "none"}
                stroke={favorite ? "red" : "black"}
                className="transition-colors"
              />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-900">
              {productData.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                    strokeWidth={1.5}
                    className="transition-transform hover:scale-110"
                  />
                ))}
              </div>
              <span className="text-gray-700 text-sm ml-2">
                {rating} ({productData.reviews || 122} reviews)
              </span>
            </div>
          </div>

          <p className="text-4xl font-bold text-gray-900 mb-4">
            {currency}
            {productData.price.toLocaleString()}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {productData.description}
          </p>

          {productData.sizes && productData.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="flex gap-3">
                {productData.sizes.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSize(item)}
                    className={`
                      px-4 py-2 rounded-md border transition-all duration-200
                      ${
                        size === item
                          ? "bg-gray-900 text-white border-gray-600 shadow-md"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="
              w-full flex items-center justify-center 
              bg-gray-600 text-white 
              py-3 rounded-lg 
              hover:bg-gray-700 
              transition-all duration-300
              disabled:opacity-50
              shadow-md hover:shadow-lg transform hover:scale-105
              group
            "
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 group-hover:animate-bounce" />
            Add to Cart
          </button>

          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            {[
              { icon: Truck, text: "Free Shipping" },
              { icon: Shield, text: "Secure Payment" },
              { icon: RefreshCw, text: "Easy Returns" },
            ].map(({ icon: Icon, text }, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center text-gray-800 hover:text-gray-600 transition-colors"
              >
                <Icon size={24} className="mb-2" />
                <p className="text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <div className="border-b mb-6">
          <button className="pb-2 border-b-2 border-gray-600 text-gray-800 font-semibold">
            Description
          </button>
          <button className="pb-2 ml-6 text-gray-700 hover:text-gray-800">
            Reviews ({productData.reviews || 122})
          </button>
        </div>

        <div className="prose max-w-none text-gray-800 space-y-4">
          <p>{productData.description}</p>
          <ul className="list-disc pl-5 mt-4 text-gray-700 space-y-2">
            <li>High-quality materials</li>
            <li>Comfortable and stylish design</li>
            <li>Perfect for everyday wear</li>
          </ul>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
