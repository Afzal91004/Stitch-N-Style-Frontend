import React from "react";
import Title from "../components/Title";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-8 py-8  text-white">
        <Title text1="Contact " text2="Us" />
        <p className="mt-2 text-lg text-black">
          We'd love to hear from you! Whether you have a question or need assistance, reach out to us.
        </p>
      </div>

      
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h1 className="text-2xl font-semibold mb-4 items-center justify-center		flex ">Our Details</h1>
          <hr/>
          <p className="text-gray-800 mb-6 mt-3 flex justify-center items-center">
            You can reach us through the following channels. We are here to help!
          </p>
          <ul className="space-y-4 p-4">
            <li>
              <h3 className="text-lg font-bold flex justify-center items-center">Give us a call</h3>
              <p className="flex justify-center items-center pt-2">Give us a call on 8860-030-033 between 10 AM to 8 PM, Monday to Saturday.</p>
            </li>
            <li>
            <h3 className="text-lg font-semibold flex justify-center items-center">Send us an email</h3>
              <p className="flex justify-center items-center pt-2">Write to us at tailorcue@gmail.com. We usually respond in 24 hours.</p>
            </li>
            <li>
            <h3 className="text-lg font-semibold flex justify-center items-center">Drop by and talk</h3>
            <p className="flex justify-center items-center pt-2">To register your complain, write to us on tailorcue@gmail.com.</p>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h3 className="text-xl font-medium mb-4 flex justify-center items-center">Send Us a Message</h3>
          <hr />
          <form>
            <div className="mb-4 mt-2">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                placeholder="Subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                id="message"
                placeholder="Your Message"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                rows="5"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
