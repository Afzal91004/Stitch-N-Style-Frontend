import React, { useContext, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  About,
  Cart,
  Collection,
  Contact,
  CustomCloth,
  Home,
  Login,
  Orders,
  PlaceOrder,
  Policy,
  Product,
  Verify,
  UserProfile,
  CustomOrderHistory,
} from "./pages/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "./context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const { token } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isProtectedRoute = [
      "/cart",
      "/custom-cloth",
      "/orders",
      "/place-order",
      // "/",
    ].includes(location.pathname);
    if (!token && isProtectedRoute) {
      navigate("/login", { state: { from: location } });
    }
  }, [token, location, navigate]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />
      <SearchBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/designers" element={<Designers />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/custom-order-history" element={<CustomOrderHistory />} />

        {/* Protected Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/craft-your-look"
          element={
            <ProtectedRoute>
              <CustomCloth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
