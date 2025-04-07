import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineSupportAgent } from "react-icons/md";

const Policy = () => {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            icon: HiOutlineArrowPathRoundedSquare,
            title: "Easy Exchange Policy",
            desc: "Exchange products effortlessly with quick processing.",
          },
          {
            icon: GiReturnArrow,
            title: "7 days return policy",
            desc: "Our return process is simple and user-friendly.",
          },
          {
            icon: MdOutlineSupportAgent,
            title: "Best Customer Support",
            desc: "Reach out anytime; we're here 24/7 to help you.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-50 to-pink-100 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-pink-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
