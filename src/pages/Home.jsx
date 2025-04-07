import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import InDemand from "../components/InDemand";
import Policy from "../components/Policy";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-pink-100">
      <div className="space-y-8">
        <section className="relative">
          <Hero />
        </section>

        <section className="transform translate-y-0 transition-transform duration-700">
          <InDemand />
        </section>

        <section className="transform translate-y-0 transition-transform duration-700">
          <LatestCollection />
        </section>

        <section className="transform translate-y-0 transition-transform duration-700">
          <Policy />
        </section>
      </div>
    </div>
  );
};

export default Home;
