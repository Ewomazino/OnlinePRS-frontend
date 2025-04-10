import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/LandingHeader"; // Assume you have a reusable header component
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";
import Footer from "../components/Footer";

// Helper function to process image_url to extract the first URL.
// It assumes that image_url is a comma-separated string.
const processDisplayImage = (imageUrl) => {
  const placeholder = "https://placehold.co/300x200/png";
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    return placeholder;
  }
  const urls = imageUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
  return urls.length > 0 ? urls[0] : placeholder;
};

const LandingPage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Example: fetch featured listings from your backend.
    axios.get("https://onlinerps-backend.onrender.com//featured-listings")
      .then((response) => {
        // Assuming the response is an array of listing objects.
        setFeaturedListings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching featured listings:", error);
      });
  }, []);

  return (
    <div className="landing-page">
      <Header />
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Home</h1>
          <p>Your dream property awaits. Explore the finest listings and book with ease.</p>
          <button onClick={() => navigate("/listings")}>Browse Listings</button>
        </div>
      </section>
      
      <section className="featured-listings">
        <h2>Featured Listings</h2>
        <div className="listings-grid">
          {featuredListings.length === 0 ? (
            <p>No listings found</p>
          ) : (
            featuredListings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card"
                onClick={() => navigate(`/public-listing/${listing.id}`)}
              >
                <img
                  src={processDisplayImage(listing.image_url)}
                  alt={listing.title}
                />
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <p>{listing.location}</p>
                  <p>${listing.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="about-us">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to our Property Rental Platform. We connect landlords and tenants seamlessly—making
            renting, booking, and managing properties a hassle-free experience. Our mission is to help you find your next
            home with a modern, user-friendly, and secure platform.
          </p>
          <p>
            With advanced search, detailed property insights, and robust booking features, we aim to make your next rental decision simple and informed.
          </p>
        </div>
        
      </section>
      <Footer />
    </div>
    
  );
};

export default LandingPage;