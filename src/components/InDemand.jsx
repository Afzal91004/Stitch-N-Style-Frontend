import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const InDemand = () => {
  const { products } = useContext(ShopContext);
  const [inDemand, setInDemand] = useState([]);

  useEffect(() => {
    console.log("Products from context:", products);
    if (products) {
      const inDemandProduct = products.filter((item) => item.bestSeller);
      console.log("Filtered inDemand products:", inDemandProduct);
      setInDemand(inDemandProduct.slice(0, 5));
    }
  }, [products]);

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <section className="pt-16 pb-1 px-4 mx-auto max-w-7xl">
      <div className="mb-12">
        <Title text1="IN-DEMAND " text2="STYLES" />
        <p className="max-w-2xl text-sm text-gray-600">
          Crafted for style, chosen by many
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {inDemand.map((item) => (
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
    </section>
  );
};

export default InDemand;
