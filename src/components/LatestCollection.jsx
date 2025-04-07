import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductLoadingPlaceholder from "./ProductLoadingPlaceholder";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
      setLoading(false);
    }
  }, [products]);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Title text1="LATEST " text2="COLLECTION" />
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm">
            Unveil Stitch & Style's latest collection, crafted to redefine
            elegance and celebrate your unique style.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading || !products || products.length === 0
            ? // Display 10 placeholders when loading
              [...Array(10)].map((_, index) => (
                <ProductLoadingPlaceholder key={`placeholder-${index}`} />
              ))
            : latestProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;
