import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  MapPin,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="text-center sm:text-left">
          <div className="flex justify-center sm:justify-start items-center mb-4">
            <img
              src={assets.sns}
              alt="Stitch & Style Logo"
              className="h-8 mr-4"
            />
            <img src={assets.kromaApps} alt="KromaApps Logo" className="h-8" />
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Crafting beautiful designs and seamless experiences for fashion
            enthusiasts.
          </p>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Stitch & Style by KromaApps
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center sm:text-left">
          <h4 className="font-semibold mb-4 text-pink-400">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "Collections", "About Us", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-pink-400 transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="text-center sm:text-left">
          <h4 className="font-semibold mb-4 text-pink-400">Our Services</h4>
          <ul className="space-y-2">
            {[
              "Custom Design",
              "Styling Consultation",
              "Alterations",
              "Wardrobe Planning",
            ].map((service) => (
              <li key={service}>
                <a
                  href={`/services/${service
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="hover:text-pink-400 transition-colors"
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div className="text-center sm:text-left">
          <h4 className="font-semibold mb-4 text-pink-400">Contact Us</h4>
          <div className="space-y-3">
            {[
              {
                icon: MapPin,
                text: "India",
              },
              {
                icon: Mail,
                text: "shaikhmohammedafjal@gmail.com",
                link: "mailto:shaikhmohammedafjal@gmail.com",
              },
              {
                icon: Phone,
                text: "+91 8169165594",
                link: "tel:+918169165594",
              },
            ].map(({ icon: Icon, text, link }) => (
              <div
                key={text}
                className="flex items-center justify-center sm:justify-start"
              >
                <Icon size={20} className="mr-2 text-pink-400" />
                {link ? (
                  <a
                    href={link}
                    className="hover:text-pink-400 transition-colors"
                  >
                    {text}
                  </a>
                ) : (
                  <p>{text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 border-t border-gray-700">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-xl font-semibold mb-4 text-center text-pink-400">
            Stay Fashionably Informed
          </h4>
          {subscribed ? (
            <p className="text-green-400 text-center">
              Thank you for subscribing!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-r-lg hover:from-pink-600 hover:to-pink-700 transition-colors flex items-center"
              >
                <Send size={20} className="mr-2" /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
