import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/NotFound.css"; // Create this CSS file for custom styling if needed

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default NotFound;