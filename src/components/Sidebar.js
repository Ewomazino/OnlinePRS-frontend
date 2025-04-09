// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/bookings">Bookings</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;