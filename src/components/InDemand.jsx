import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductLoadingPlaceholder from "./ProductLoadingPlaceholder";

const InDemand = () => {
  const { products } = useContext(ShopContext);
  const [inDemand, setInDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Products from context:", products);
    if (products && products.length > 0) {
      const inDemandProduct = products.filter((item) => item.bestSeller);
      console.log("Filtered inDemand products:", inDemandProduct);
      setInDemand(inDemandProduct.slice(0, 5));
      setLoading(false);
    }
  }, [products]);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <Title text1="IN-DEMAND " text2="STYLES" />
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm">
            Crafted for style, chosen by many
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading || !products || products.length === 0
            ? // Display 5 placeholders when loading
              [...Array(5)].map((_, index) => (
                <ProductLoadingPlaceholder key={`placeholder-${index}`} />
              ))
            : inDemand.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  imageAlt={`${item.name} product image`}
                  name={item.name}
                  price={item.price}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default InDemand;
