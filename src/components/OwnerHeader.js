import React, { useState } from 'react';
import '../css/Header.css'; // Import custom header styles
import Toast from './Toast'; 

const OwnerHeader = ({ links, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Call the logout function passed in as a prop
    }
  };

  return (
    <header className="header">
      <div className="logo">
        OnlinePRS
      </div>

      <div className="header-actions">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`menu ${menuOpen ? 'active' : ''}`}>
        <a href="/owner-dashboard">Home</a>
          <a href="/booking-requests">Requests</a>
          <a href="/add-listing">New Listing</a>
          <a href="/profile">Profile</a>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;