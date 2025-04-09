import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/TenantDashboard.css"; // Use your existing CSS file
import "../css/BookingHistory.css";   // Additional styles if needed
import Header from "./Header";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";

// Helper function to process image_url into a flat array of URLs and return the first URL.
const processDisplayImage = (imageUrl) => {
  const placeholder = "https://placehold.co/150x100/png"; // Fallback placeholder

  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim().length === 0) {
    return placeholder;
  }

  const urls = imageUrl.split(",")
    .map(url => url.trim())
    .filter(url => url.length > 0);
    
  return urls.length > 0 ? urls[0] : placeholder;
};

const MyBookings = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  console.log("Token being sent:", token);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get("https://online-prs-frontend.vercel.app/booking-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched booking history:", response.data);
        setBookingHistory(response.data);
      } catch (err) {
        console.error("Error fetching booking history:", err);
      }
    };

    fetchBookingHistory();
  }, [token]);

  // Toast handling using the built Toast component.
  const showToast = (message) => {
    setToastMessage(message);
  };

  // Cancel handler now uses the flat listing_id from the booking object.
  const handleCancel = async (listingId) => {
    try {
      await axios.delete(`https://online-prs-frontend.vercel.app/cancel-book?listingId=${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      // Remove the canceled booking using booking.listing_id.
      setBookingHistory(prevHistory =>
        prevHistory.filter((booking) => booking.listing_id !== listingId)
      );
      showToast("Booking request cancelled.");
    } catch (err) {
      showToast("Cancel failed");
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        links={[]}
        onLogout={() => {
          localStorage.removeItem("authToken");
          window.location.reload();
        }}
      />

      <div className="booking-history">
        <h2>My Bookings</h2>
        {bookingHistory.length === 0 ? (
          <p>You have no past bookings.</p>
        ) : (
          bookingHistory.map((booking) => {
            // Destructure the booking object.
            // Here we assume the booking object contains:
            // booking.id, booking.listing_id, booking.status, booking.bookingDate,
            // and a nested booking.listing for additional listing details.
            const { id, listing, status, bookingDate, listing_id } = booking;

            if (!listing) return null; // Skip if listing details are missing.

            // Process listing.image_url (assuming a comma-separated string)
            const displayImage = processDisplayImage(listing.image_url);

            // Normalize status to lowercase.
            const normalizedStatus = status ? status.toLowerCase() : "";

            let actionButton = null;
            // Show Cancel Booking if the status is "pending".
            if (normalizedStatus === "pending") {
              actionButton = (
                <button
                  onClick={() => handleCancel(listing_id)}
                  style={{ backgroundColor: "#dc3545" }}
                >
                  Cancel Booking
                </button>
              );
            }

            return (
              <div key={id} className="booking-card">
                <img src={displayImage} alt={listing.title} />
                <div className="booking-details">
                  <h3>{listing.title}</h3>
                  <p><strong>Location:</strong> {listing.location}</p>
                  <p><strong>Price:</strong> ${listing.price}</p>
                  <p>
                    <strong>Booking Date:</strong> {new Date(bookingDate).toLocaleDateString()}
                  </p>
                  <p className={`status-badge status-${normalizedStatus}`}>
                    {status}
                  </p>
                  {actionButton}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {toastMessage && (
        <Toast message={toastMessage} duration={3000} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

export default MyBookings;