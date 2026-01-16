// src/Components/Login/LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added FaEye and FaEyeSlash
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./../../context/AuthContext.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NEW STATE: To control password visibility
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // ==========================
  // 🔑 Handle form submission
  // ==========================
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login({ email, password });

      if (data.success) {
        const userEmail = data.user?.email?.toLowerCase();

        // Navigate based on user email/role
        if (userEmail === "admin@gmail.com") {
          navigate("/ordersanalysis");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Smart error extraction
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unknown error occurred during login.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 👁️ Toggle visibility handler
  // ==========================
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>

        {/* Inline error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Email Input */}
        <div className="inputbox">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <FaUser className="icon" />
        </div>

        {/* Password Input (Modified for Toggle) */}
        <div className="inputbox">
          <input
            // DYNAMIC TYPE: changes based on showPassword state
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {/* DYNAMIC ICON: Toggles visibility on click */}
          {showPassword ? (
            <FaEyeSlash className="icon" onClick={handleTogglePassword} style={{ cursor: 'pointer' }} />
          ) : (
            <FaEye className="icon" onClick={handleTogglePassword} style={{ cursor: 'pointer' }} />
          )}
        </div>

        {/* Remember & Forgot Password */}
        <div className="remember forgot">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember me
          </label>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Registration Link */}
        <div className="register-link">
          <p>
            Don't have an account? <Link to="/signup">Register Here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;