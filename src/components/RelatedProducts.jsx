import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const relatedProducts = products
        .filter(
          (item) =>
            item.category === category && item.subCategory === subCategory
        )
        .slice(0, 5);
      setRelated(relatedProducts);
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        <Title text1={"RELATED "} text2={" PRODUCTS"} />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {related.map((item) => (
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
  );
};

export default RelatedProducts;
