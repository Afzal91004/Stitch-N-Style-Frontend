import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    }
  }, [token, navigate, location]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          toast.success("Login successful!", {
            autoClose: 5000,
            closeOnClick: true,
          });

          const from = location.state?.from?.pathname || "/";
          navigate(from);
        }
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Account created successfully! Please login.");
          setCurrentState("Login");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 to-pink-100 p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white shadow-lg sm:shadow-xl md:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold sm:font-extrabold text-center text-gray-800 mb-4 sm:mb-6">
            {currentState === "Login" ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={onSubmitHandler} className="space-y-4 sm:space-y-6">
            {currentState === "Sign Up" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {currentState === "Sign Up" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
            >
              {currentState === "Login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() =>
                setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
              }
              className="text-sm sm:text-base text-gray-600 hover:underline focus:outline-none"
            >
              {currentState === "Login"
                ? "Create a new account"
                : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-2 sm:mt-4 text-center">
            <button className="text-xs sm:text-sm text-gray-500 hover:underline focus:outline-none">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </div>
  );
};

export default Login;
