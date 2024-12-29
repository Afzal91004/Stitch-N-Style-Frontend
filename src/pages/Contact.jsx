import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        to_email: "shaikhmohammedafjal@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );

      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="px-8 py-12">
        <Title text1="Contact " text2="Us" />
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          We'd love to hear from you! Whether you have a question about our
          services, need assistance, or want to share feedback, we're here to
          help.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Our Details
          </h1>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-8" />

          <div className="space-y-8">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-8 h-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Give us a call
                </h3>
                <p className="text-gray-600 mt-1">
                  Available from 10 AM to 8 PM, Monday to Saturday
                  <br />
                  <span className="font-medium">8860-030-033</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Mail className="w-8 h-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Send us an email
                </h3>
                <p className="text-gray-600 mt-1">
                  We usually respond within 24 hours
                  <br />
                  <span className="font-medium">kromaapps@gmail.com</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <MapPin className="w-8 h-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Drop by and talk
                </h3>
                <p className="text-gray-600 mt-1">
                  For complaints or feedback, email us at
                  <br />
                  <span className="font-medium">kromaapps@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Send Us a Message
          </h3>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-gray-700 font-medium mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow"
                rows="5"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-pink-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Contact;
