import React from "react";

export const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col justify-center gap-2 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-[2px] bg-gradient-to-r from-pink-400 to-transparent"></div>
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-pink-500">{text1}</span>
          <span className="text-gray-800">{text2}</span>
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-gray-800 to-transparent"></div>
      </div>
    </div>
  );
};

export default Title;
