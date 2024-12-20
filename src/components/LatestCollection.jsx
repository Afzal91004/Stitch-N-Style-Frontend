import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="py-16 px-4 mx-auto max-w-7xl">
      <div className="text-center mb-12">
        <Title text1="LATEST " text2="COLLECTION" />
        <p className="max-w-2xl  text-sm text-gray-600">
          Unveil Stitch & Style's latest collection, crafted to redefine
          elegance and celebrate your unique style.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* <div className="mt-12 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
        >
          View All Collections
          <ChevronRight size={16} />
        </Link>
      </div> */}
    </section>
  );
};

export default LatestCollection;
