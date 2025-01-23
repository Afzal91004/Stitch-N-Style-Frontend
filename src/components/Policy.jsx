import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineSupportAgent } from "react-icons/md";

const Policy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 items-center  text-center py-20 text-xs sm:text-sm md:text-base text-gray-800">
      <div className="place-items-center">
        <HiOutlineArrowPathRoundedSquare className="h-12 w-12 text-black font-black m-4" />
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="text-gray-700">
          Exchange products effortlessly with quick processing.
        </p>
      </div>
      <div className="place-items-center">
        <GiReturnArrow className="h-12 w-12 text-black font-black m-4" />
        <p className="font-semibold">7 days return policy</p>
        <p className="text-gray-700">
          Our return process is simple and user-friendly.
        </p>
      </div>
      <div className="place-items-center">
        <MdOutlineSupportAgent className="h-12 w-12 text-black font-black m-4" />
        <p className="font-semibold">Best Customer Support</p>
        <p className="text-gray-700">
          Reach out anytime; we’re here 24/7 to help you.
        </p>
      </div>
    </div>
  );
};

export default Policy;
