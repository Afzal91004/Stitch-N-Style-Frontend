import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import InDemand from "../components/InDemand";
import Policy from "../components/Policy";

const Home = () => {
  return (
    <div>
      <Hero />
      <InDemand />
      <LatestCollection />
      <Policy />
    </div>
  );
};

export default Home;
