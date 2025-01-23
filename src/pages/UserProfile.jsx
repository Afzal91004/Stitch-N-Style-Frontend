// some components are remaining...
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setUser(response.data);
        setEditedUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put("/api/user/profile", editedUser);
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 p-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <div className="flex flex-col justify-center gap-6 mb-8">
          <div className="flex items-center gap-3 w-full justify-center">
            <h2 className="text-4xl font-semibold text-gray-800 tracking-tight">
              <span className="text-pink-500">User</span>&nbsp;
              <span className="text-gray-900">Profile</span>
            </h2>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={editedUser.name || ""}
                onChange={handleInputChange}
                className="w-full px-6 py-3 border border-pink-400 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={editedUser.email || ""}
                onChange={handleInputChange}
                className="w-full px-6 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSaveChanges}
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300 font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Email Address</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-300 font-semibold"
            >
              <FaUserEdit className="mr-2" />
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
