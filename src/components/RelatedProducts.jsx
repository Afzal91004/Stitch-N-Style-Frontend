import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "./ProductItem";
import ProductLoadingPlaceholder from "./ProductLoadingPlaceholder";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (products && products.length > 0 && category && subCategory) {
      const relatedProducts = products
        .filter(
          (item) =>
            item.category === category && item.subCategory === subCategory
        )
        .slice(0, 5);
      setRelated(relatedProducts);
      setLoading(false);
    }
  }, [products, category, subCategory]);

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Title text1={"RELATED "} text2={" PRODUCTS"} />
          <p className="text-gray-600 text-sm mt-2">
            {loading ? (
              <span className="animate-pulse bg-gray-200 rounded w-48 h-4 inline-block"></span>
            ) : (
              "You might also like these selections"
            )}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading || related.length === 0
            ? // Display placeholders when loading or when no related products found
              [...Array(5)].map((_, index) => (
                <ProductLoadingPlaceholder key={`placeholder-${index}`} />
              ))
            : related.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
