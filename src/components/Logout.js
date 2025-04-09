// Logout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Toast from './Toast'; // Import Toast component
import '../css/Logout.css'; // Custom CSS for Logout button and styles

const Logout = ({ redirectTo = "/login", showToast = true, onLogout }) => {
  const [showToastMessage, setShowToastMessage] = useState(false); // For showing toast message
  const navigate = useNavigate(); // For page navigation

  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem('authToken');
    
    // Show the toast if specified
    if (showToast) {
      setShowToastMessage(true);
      setTimeout(() => {
        setShowToastMessage(false); // Hide the toast after 2 seconds
      }, 2000);
    }

    // Call the optional callback function passed via props
    if (onLogout) {
      onLogout();
    }

    // Redirect user to the specified page (default: login page)
    setTimeout(() => {
      navigate.push(redirectTo);
    }, 1500); // Wait for the toast to disappear before redirecting
  };

  return (
    <div>
      {/* Optional: Render toast notification */}
      {showToastMessage && <Toast message="You have been logged out!" />}

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Logout;