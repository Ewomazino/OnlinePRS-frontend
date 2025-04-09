import React, { useState } from 'react';
import '../css/Header.css'; // Import custom header styles
import Toast from './Toast'; 

const Header = ({ links, onLogout }) => {
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
        <a href="/tenant-dashboard">Home</a>
          <a href="/my-bookings">My Bookings</a>
          <a href="/profile">Profile</a>
          <a href="/logout">Logout</a>
        </div>
      </div>
    </header>
  );
};

export default Header;