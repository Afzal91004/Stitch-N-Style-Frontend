import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col justify-center gap-2 mb-1">
      <div className="flex items-center gap-3">
        <div className="w-8 h-[1.5px] bg-gray-400"></div>
        <h2 className="text-3xl font-semibold tracking-tight">
          <span className="text-gray-400">{text1}</span>
          <span className="text-gray-900">{text2}</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-gray-900"></div>
      </div>
    </div>
  );
};

export default Title;
