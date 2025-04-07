import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Heart, Share2, Clock, User, Tag, ArrowLeft } from "lucide-react";
import Title from "../components/Title";

const DesignDetailsPage = () => {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedDesigns, setRelatedDesigns] = useState([]);

  useEffect(() => {
    const fetchDesignDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/design/${id}`
        );
        setDesign(res.data.data);
        setLikeCount(res.data.data.likes || 0);

        // Fetch related designs from same category
        const relatedRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/design/list?category=${
            res.data.data.category
          }&limit=5`
        );
        // Filter out current design from related designs
        setRelatedDesigns(
          relatedRes.data.data.filter((item) => item._id !== id)
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching design details:", error);
        setError("Failed to load design details");
        setLoading(false);
      }
    };

    fetchDesignDetails();
  }, [id]);

  const handleLike = async () => {
    try {
      // This would normally check if user is logged in first
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/design/like/${id}`
      );
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking design:", error);
    }
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      </div>
    );

  if (!design) return null;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back button with updated styling */}
      <Link
        to="/designs"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to all designs</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Left column - Images with enhanced styling */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
            <img
              src={design.image && design.image[currentImageIndex]}
              alt={design.name}
              className="w-full h-[500px] object-cover object-center hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Thumbnail gallery with consistent styling */}
          {design.image && design.image.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {design.image.map((img, index) => (
                <button
                  key={index}
                  className={`
                    relative rounded-lg overflow-hidden cursor-pointer
                    ${
                      currentImageIndex === index
                        ? "ring-2 ring-pink-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-pink-300 hover:ring-offset-2"
                    }
                    transition-all duration-300
                  `}
                  onClick={() => handleImageChange(index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Details with enhanced styling */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {design.name}
            </h1>
            <Link
              to={`/designer/${design.designer?._id}`}
              className="inline-flex items-center space-x-2 text-pink-500 hover:text-pink-600"
            >
              <User className="w-4 h-4" />
              <span>{design.designer?.name || "Unknown Designer"}</span>
            </Link>
          </div>

          {/* Social actions with consistent styling */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg 
                transition-all duration-300
                ${isLiked ? "bg-pink-50 text-pink-500" : "hover:bg-gray-50"}
              `}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-pink-500 text-pink-500" : "text-gray-400"
                }`}
              />
              <span>{likeCount}</span>
            </button>

            <button className="flex items-center text-gray-600 hover:text-pink-500 transition-colors">
              <Share2 className="w-5 h-5 mr-1" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Tag className="w-5 h-5" />
            <span>{design.category}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>Auction ending in {design.duration} days</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-semibold">Current Bid:</p>
            <p className="text-3xl font-bold text-pink-600">
              ₹{design.startingBid || 0}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{design.description}</p>
          </div>

          <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-[1.01] duration-200 font-semibold text-lg shadow-md">
            Place Bid
          </button>
        </div>
      </div>

      {/* Related designs section */}
      {relatedDesigns.length > 0 && (
        <section className="mt-16 bg-gradient-to-b from-white to-gray-50 py-12 rounded-2xl">
          <div className="mb-8">
            <Title text1="SIMILAR " text2="DESIGNS" />
            <h2 className="max-w-2xl text-sm text-gray-600">
              You might also like these designs
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {relatedDesigns.map((design) => (
              <Link to={`/design/${design._id}`} key={design._id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative pb-[100%]">
                    <img
                      src={design.image?.[0]}
                      alt={design.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 truncate">
                      {design.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {design.designer?.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-pink-600 font-bold">
                        ₹{design.startingBid}
                      </p>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {design.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DesignDetailsPage;
