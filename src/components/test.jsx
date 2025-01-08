import React from "react";
import { assets } from "../assets/frontend_assets/assets";

const Test = () => {
    return (
        <div className="bg-gray-100 text-gray-800 font-[Manrope] container mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
  {/* "Who we are" */}
  <div className="w-full max-w-3xl bg-white p-5 pt-24 rounded-2xl shadow-sm hover:shadow-md hover:shadow-black/40 transition-shadow">
    <p className="text-2xl font-bold mb-4">Who we are</p>
    <p className="text-base text-gray-700 leading-relaxed">
      KromaApps is dedicated to nurturing the next generation of developers.
      Our mission is simple: Empower developers by assigning meaningful
      tasks, guide them through challenges, and encourage creativity by
      turning their ideas into real-world projects. We believe in learning
      by doing, fostering collaboration, and growing together!
    </p>
  </div>


    
          <div className="flex flex-wrap justify-center items-center bg-gray-100 p-6 space-y-6">
  {/* "Meet the Team" */}
  <div className="text-center mb-6">
    <h2 className="text-3xl font-bold text-gray-800">Meet the Team</h2>
  </div>

  {/* Team Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
    {/* Card Component */}
    {[
      {
        name: "Mohammed Afjal Shaikh",
        role: "Fullstack Web Developer, React Native Developer, and Founder of KromaApps.",
      },
      {
        name: "Maria Malik",
        role: "Frontend Web Developer",
      },
      {
        name: "Mohammed Shadab Ali",
        role: "Graphic Designer, Logo Designer, Report Creator, and Frontend Developer",
      },
      {
        name: "Alfiya Inamdar",
        role: "Fullstack Web Developer",
      },
      {
        name: "Khan Tufail Ahmed",
        role: "Frontend Web Developer",
      },
      {
        name: "Khan Shoeb",
        role: "Frontend Developer",
      },
      {
        name: "Wahid",
        role: "Frontend Web Developer",
      },
      {
        name: "Alfiya",
        role: "Frontend Web Developer",
      },
      {
        name: "Asjad Usmani",
        role: "Backend Developer",
      },
    ].map((teamMember, index) => (
      <div
        key={index}
        className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-md hover:shadow-black/40 transition-shadow"
      >
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{teamMember.name}</div>
          <p className="text-gray-700 text-base">{teamMember.role}</p>
        </div>
      </div>
    ))}
  </div>
</div>

</div>

        
      );
    };
    

export default Test;
