import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/LandingHeader"; // Reusable header component
import { useNavigate } from "react-router-dom";
import "../css/ListingsPage.css";
import Footer from "../components/Footer";

// Helper function to process image_url into a flat array and return the first URL.
const processDisplayImage = (imageUrl) => {
  const placeholder = "https://placehold.co/300x200/png";
  
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    return placeholder;
  }
  
  // Split the comma-separated string into an array, trim, and filter out empty values.
  const urls = imageUrl.split(",").map(url => url.trim()).filter(url => url.length > 0);
  return urls.length > 0 ? urls[0] : placeholder;
};

const ListingsPage = () => {
  const [publicListings, setPublicListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Set the number of listings per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicListings = async () => {
      try {
        const response = await axios.get("https://online-rps-backend.vercel.app/public-listings");
        setPublicListings(response.data);
      } catch (err) {
        console.error("Error fetching public listings:", err);
      }
    };
    
    fetchPublicListings();
  }, []);

  // Calculate indices for slicing.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = publicListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(publicListings.length / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="listings-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to PropertyRental</h1>
          <p>Discover your perfect home from our curated listings.</p>
          <button onClick={() => navigate("/listings")}>Browse Listings</button>
        </div>
      </section>
      
      {/* Featured Listings Section */}
      <section className="featured-listings">
        <h2>Available Properties</h2>
        <div className="listings-grid">
          {currentListings.length === 0 ? (
            <p>No listings available at the moment.</p>
          ) : (
            currentListings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card"
                onClick={() => navigate(`/public-listing/${listing.id}`)}
              >
                <img src={processDisplayImage(listing.image_url)} alt={listing.title} />
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <p className="location">{listing.location}</p>
                  <p className="price">${listing.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
      
      {/* About Us Section */}
      <section className="about-us">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            At PropertyRental, our mission is to simplify your search for the perfect property.
            We connect property owners and tenants seamlessly, making renting hassle-free.
          </p>
          <p>
            With a user-friendly interface, secure booking, and a wide range of listings, we help you
            find your next home quickly and easily.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ListingsPage;