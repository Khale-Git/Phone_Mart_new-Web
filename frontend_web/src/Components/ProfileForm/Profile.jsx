import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaIdBadge } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import "./Profile.css"; 
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card glass-effect">
        
        {/* Header / Avatar Section */}
        <div className="profile-header">
          <div className="avatar-container">
            <FaUserCircle className="profile-avatar-icon" />
          </div>
          <h2>{user ? user.username : "Guest User"}</h2>
          <p className="profile-role">Member</p>
        </div>

        {/* Error Message */}
        {error && <div className="profile-error">{error}</div>}

        {/* User Details Section */}
        {user ? (
          <div className="profile-body">
            <div className="info-group">
              <label><FaIdBadge /> Username</label>
              <div className="info-value">{user.username}</div>
            </div>

            <div className="info-group">
              <label><FaEnvelope /> Email Address</label>
              <div className="info-value">{user.email}</div>
            </div>

            <button onClick={handleLogout} className="profile-logout-btn">
              <IoLogOutOutline size={20} /> Log Out
            </button>
          </div>
        ) : (
          <div className="guest-state">
            <p>Session expired or no user data.</p>
            <Link to="/login" className="login-link-btn">Log In to Continue</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;