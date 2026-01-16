import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
// These are correctly implemented from the standardization upgrade
import { AuthProvider, useAuth } from "./context/AuthContext"; 

// ==========================
// 📦 Component Imports
// ==========================
import Dashboard from "./Components/DashboardForm/Dashboard";
import Orders from "./Components/OrdersForm/Orders";
import Login from "./Components/LoginForm/LoginForm";
import Signup from "./Components/SignUp/SignUpForm";
import Profile from "./Components/ProfileForm/Profile";
import Cart from "./Components/Cart/Cart";
import Users from "./Components/Users/Users";
import OrdersAnalysis from "./Components/Ordersanalysis/OrdersAnalysis";
import Blog from "./Components/Blog/Blog.jsx";
import { CartProvider } from "./Components/OrdersForm/CartContext";
import AdminDashboard from "./AdminDash/AdminDashboard";


// Assuming you have a component to display the main product list
// Since you have a Dashboard, we'll use that as the primary product view for now.
// If you create a separate Products/Shop component, you'd import it here.
const Products = Dashboard; // Placeholder: Products are usually displayed on the Dashboard

// Icons
import { FaHome, FaUsers, FaChartBar, FaNewspaper, FaBoxes, FaLock } from "react-icons/fa"; 
import { VscAccount } from "react-icons/vsc";
import { CiShoppingBasket, CiShoppingCart } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

// Styles
import "./App.css";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

function MainApp() {
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <h3>Loading your session...</h3>
      </div>
    );
  }

  // ==========================
  // 🔐 Route Guards
  // ==========================
  // Checks if user is logged in. If not, redirects to login.
  const ProtectedRoute = ({ children }) => (user ? children : <Navigate to="/login" replace />);
  
  // Checks if user is admin. If not, redirects to dashboard.
  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.email.toLowerCase() !== "admin@gmail.com") return <Navigate to="/dashboard" replace />;
    return children;
  };

  // ==========================
  // 🔒 Logout Handler
  // ==========================
  const handleLogout = async () => {
    try {
      await logout();
      // Using window.location.href forces a full reload, clearing the local state effectively
      window.location.href = "/login"; 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div className="app-container">
      {/* Burger Menu */}
      {!isAuthPage && (
        <>
          <input type="checkbox" id="burger" className="burger-input" />
          <label htmlFor="burger" className="burger">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </>
      )}

      {/* Sidebar */}
      {!isAuthPage && user && (
        <nav className="sidebar">
          <ul>
            <li>
              <Link to="/dashboard">
                <FaHome /> Dashboard
              </Link>
            </li>
            
            {/* Added Products Link */}
            <li>
              <Link to="/products">
                <FaBoxes /> Products
              </Link>
            </li>

            <li>
              <Link to="/orders">
                <CiShoppingBasket /> Orders
              </Link>
            </li>

            <li>
              <Link to="/cart">
                <CiShoppingCart /> Cart
              </Link>
            </li>

            <li>
              <Link to="/profile">
                <VscAccount /> Profile
              </Link>
            </li>

            <li>
              <Link to="/blog">
                <FaNewspaper /> Blog
              </Link>
            </li>

            {/* Admin-only links */}
            {user.email.toLowerCase() === "admin@gmail.com" && (
              <>
                <li>
                  <Link to="/ordersanalysis">
                    <FaChartBar /> Orders Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/users">
                    <FaUsers /> Manage Users
                  </Link>
                </li>
                <li>
                  <Link to="/admindashboard">
                    <FaLock /> Admin Dashboard
                  </Link>
                </li>   
              </>
            )}

            <li className="auth-link" onClick={handleLogout}>
              <IoIosLogOut /> Logout
            </li>
          </ul>
        </nav>
      )}

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard */}
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />  
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

          {/* Admin-only Routes */}
          <Route path="/ordersanalysis" element={<AdminRoute><OrdersAnalysis /></AdminRoute>} />
          <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admindashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;