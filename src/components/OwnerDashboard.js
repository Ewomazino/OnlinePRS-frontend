import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerHeader from './OwnerHeader';
import { useNavigate } from 'react-router-dom';
import '../css/OwnerDashboard.css';

// Helper function to process a nested image_url field and return the first valid URL.
const processNestedImageUrl = (imageUrl) => {
  const placeholder = "https://placehold.co/600x400"; // Fallback placeholder

  if (!imageUrl) return placeholder;

  // If imageUrl is a string, assume it's comma-separated.
  if (typeof imageUrl === "string") {
    const urls = imageUrl.split(",").map(url => url.trim()).filter(url => url.length > 0);
    return urls.length > 0 ? urls[0] : placeholder;
  }

  // If imageUrl is an array...
  if (Array.isArray(imageUrl)) {
    // Check if the first element is an array (nested structure)
    if (imageUrl.length > 0 && Array.isArray(imageUrl[0])) {
      const flatArray = imageUrl.flat().map(url => (typeof url === "string" ? url.trim() : ""));
      return flatArray.filter(url => url.length > 0)[0] || placeholder;
    } else {
      const validArray = imageUrl.map(url => (typeof url === "string" ? url.trim() : "")).filter(url => url.length > 0);
      return validArray[0] || placeholder;
    }
  }

  return placeholder;
};

const OwnerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of listings to show per page
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("https://onlinerps-backend.onrender.com//owner-listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, [token]);

  const handleDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`https://onlinerps-backend.onrender.com//delete-listing/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(prevListings => prevListings.filter(listing => listing.id !== listingId));
        alert("Listing deleted successfully.");
      } catch (err) {
        alert("Error deleting listing.");
        console.error("Error deleting listing:", err);
      }
    }
  };

  // Pagination logic:
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="dashboard-container">
      <OwnerHeader />
      <div className="owner-dashboard">
        <h2>Your Listings</h2>
        {listings.length === 0 ? (
          <p>You have no listings or bookings yet.</p>
        ) : (
          currentListings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <h3>{listing.title}</h3>
              <img 
                src={processNestedImageUrl(listing.image_url)} 
                alt={listing.title} 
              />
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p>{listing.description}</p>
              <div className="listing-actions">
                <button onClick={() => navigate(`/edit-listing/${listing.id}`)}>
                  Edit Listing
                </button>
                <button onClick={() => handleDelete(listing.id)} className="delete-button">
                  Delete Listing
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {listings.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => paginate(idx + 1)}
              className={currentPage === idx + 1 ? "active" : ""}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;