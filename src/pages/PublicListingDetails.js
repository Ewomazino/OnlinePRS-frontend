import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/LandingHeader"; // Reusable header component
import { useParams, useNavigate } from "react-router-dom";
import "../css/PublicListingDetails.css";
import Footer from "../components/Footer";

// Helper function to process image_url into a flat array of URLs.
const processImageUrls = (imageUrl) => {
  const placeholder = "https://placehold.co/300x180/png"; // Fallback placeholder
  
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    return [placeholder];
  }
  
  // Split the comma-separated string into an array, trim, and filter out empty strings.
  const urls = imageUrl.split(",").map(url => url.trim()).filter(url => url.length > 0);
  return urls.length > 0 ? urls : [placeholder];
};

const PublicListingDetails = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Check authentication by reading token from localStorage.
  const isAuthenticated = Boolean(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://onlinerps-backend.onrender.com//public-listing?listingId=${listingId}`);
        // If the response is an array, take the first element.
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log("Fetched listing data:", data);
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };
    fetchListing();
  }, [listingId]);

  if (!listing) {
    return <p>Loading listing details...</p>;
  }

  // Process the image_url field into an array of image URLs.
  const imageUrls = processImageUrls(listing.image_url);
  console.log("Processed image URLs:", imageUrls);

  // Handlers for slider navigation.
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="public-listing-details-container">
      <Header />
      <div className="public-listing-details">
        <h2 className="listing-title">{listing.title}</h2>
        
        {/* Image Slider Section */}
        <div className="gallery">
          <div className="slider">
            <img 
              src={imageUrls[currentIndex]} 
              alt={`Slide ${currentIndex + 1}`} 
              className="listing-image" 
            />
            {imageUrls.length > 1 && (
              <>
                <button className="prev-button" onClick={handlePrev}>&#10094;</button>
                <button className="next-button" onClick={handleNext}>&#10095;</button>
              </>
            )}
          </div>
          {/* Optional: Dots / thumbnails for navigation can go here */}
        </div>
        
        <p className="listing-description">
          <strong>Description:</strong> {listing.description}
        </p>
        <p className="listing-info">
          <strong>Location:</strong> {listing.location}
        </p>
        <p className="listing-info">
          <strong>Price:</strong> ${listing.price}
        </p>

        {/* Landlord/Owner Information Section */}
        <div className="landlord-info">
          <h3>Contact Owner</h3>
          {isAuthenticated ? (
            <>
              <p>
                <strong>Name:</strong> {listing.landlord && listing.landlord.name ? listing.landlord.name : "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {listing.landlord && listing.landlord.email ? listing.landlord.email : "N/A"}
              </p>
              {/* Optionally, include a mailto link or a contact form */}
            </>
          ) : (
            <div className="login-prompt">
              <p>Please sign in to view owner contact details and make a booking request.</p>
              <div className="login-buttons">
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Sign Up</button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>


    
  );
};

export default PublicListingDetails;