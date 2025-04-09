import React from "react";
import { Link } from "react-router-dom";
import "../css/LandingHeader.css";

const LandingHeader = () => {
  // Retrieve token and accountType from localStorage.
  const token = localStorage.getItem("authToken");
  const accountType = localStorage.getItem("accountType");

  // Determine dashboard link based on accountType.
  let dashboardLink = "/"; // default fallback
  if (accountType === "property-owner") {
    dashboardLink = "/owner-dashboard";
  } else if (accountType === "potential-renter") {
    dashboardLink = "/tenant-dashboard";
  }

  return (
    <header className="landing-header">
      <div className="logo">
        <Link to="/">
          <h1>OnlinePRS</h1>
        </Link>
      </div>
      <nav className="landing-nav">
        <ul>
        <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/listings">Listings</Link>
          </li>
          
          {/* If user is authenticated, show Dashboard link; otherwise, show Login and Sign Up */}
          {token ? (
            <li>
              <Link to={dashboardLink}>Dashboard</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default LandingHeader;