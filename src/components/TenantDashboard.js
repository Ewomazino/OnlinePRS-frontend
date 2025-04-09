import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/TenantDashboard.css"; // Use your existing CSS file
import Header from "./Header";  // Reusable header component
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";

const TenantDashboard = () => {
  const [listings, setListings] = useState([]);
  // bookingsMap now stores objects: { status, bookingDate }
  const [bookingsMap, setBookingsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("price-ascending");
  const [toastMessage, setToastMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingsAndBookings = async () => {
      try {
        const [listingsRes, bookingsRes] = await Promise.all([
          axios.get("https://online-prs-frontend.vercel.app/listings"),
          axios.get("https://online-prs-frontend.vercel.app/my-bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setListings(listingsRes.data);

        // Create a bookings map as an object: listingId => { status, bookingDate }
        const bookingInfoMap = {};
        bookingsRes.data.forEach((b) => {
          bookingInfoMap[b.listingId] = {
            status: b.status || "",
            bookingDate: b.booking_date || "",
          };
        });
        console.log("Bookings map:", bookingInfoMap);
        setBookingsMap(bookingInfoMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchListingsAndBookings();
  }, [token]);

  // Toast handling: show a message and then clear after a timeout.
  const showToast = (message) => {
    setToastMessage(message);
  };

  const onToastClose = () => {
    setToastMessage("");
  };

  const handleBook = async (listingId) => {
    try {
      await axios.post(
        "https://online-prs-frontend.vercel.app/book",
        { listingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Set booking info as pending with current time
      setBookingsMap({
        ...bookingsMap,
        [listingId]: { status: "pending", bookingDate: new Date().toISOString() },
      });
      showToast("Booking request sent!");
    } catch (err) {
      showToast(err.response?.data?.error || "Booking failed");
    }
  };

  const handleCancel = async (listingId) => {
    try {
      await axios.delete(`https://online-prs-frontend.vercel.app/cancel-book?listingId=${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newMap = { ...bookingsMap };
      delete newMap[listingId];
      setBookingsMap(newMap);
      showToast("Booking request cancelled.");
    } catch (err) {
      showToast("Cancel failed");
    }
  };

  // Filter listings based on the search term.
  const filteredListings = listings.filter((listing) => {
    const searchTermLower = searchTerm.toLowerCase();
    const amenitiesArray = Array.isArray(listing.amenities)
      ? listing.amenities
      : [listing.amenities];
    return (
      listing.title.toLowerCase().includes(searchTermLower) ||
      listing.location.toLowerCase().includes(searchTermLower) ||
      (listing.description &&
        listing.description.toLowerCase().includes(searchTermLower)) ||
      amenitiesArray.some((a) => a.toLowerCase().includes(searchTermLower))
    );
  });

  // Sorting logic
  const sortedListings = filteredListings.sort((a, b) => {
    switch (sortOption) {
      case "price-ascending":
        return a.price - b.price;
      case "price-descending":
        return b.price - a.price;
      case "location-ascending":
        return a.location.localeCompare(b.location);
      case "location-descending":
        return b.location.localeCompare(a.location);
      default:
        return 0;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  const links = [
    { label: "Home", url: "/home" },
    { label: "Listings", url: "/listings" },
    { label: "Profile", url: "/profile" },
  ];

  return (
    <div className="dashboard-container">
      <Header links={links} onLogout={handleLogout} />

      <div className="header-search">
        <input
          type="text"
          placeholder="Search Listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="sort-dropdown">
        <label htmlFor="sort-option">Sort By:</label>
        <select
          id="sort-option"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="price-ascending">Price: Low to High</option>
          <option value="price-descending">Price: High to Low</option>
          <option value="location-ascending">Location: A to Z</option>
          <option value="location-descending">Location: Z to A</option>
        </select>
      </div>

      <div className="listing-grid">
        {sortedListings.length === 0 ? (
          <p>No listings found</p>
        ) : (
          sortedListings.map((listing) => {
            // Process the image_url field: Handle nested arrays.
            let imageUrls = [];
            if (Array.isArray(listing.image_url)) {
              // If it's an array of arrays, flatten it.
              if (
                listing.image_url.length > 0 &&
                Array.isArray(listing.image_url[0])
              ) {
                imageUrls = listing.image_url.flat();
              } else {
                imageUrls = listing.image_url;
              }
              imageUrls = imageUrls
                .map((url) => url.toString().trim())
                .filter((url) => url.length > 0);
            } else if (
              typeof listing.image_url === "string" &&
              listing.image_url.trim().length > 0
            ) {
              imageUrls = listing.image_url
                .split(",")
                .map((url) => url.trim())
                .filter((url) => url.length > 0);
            }
            // Use the first URL as the display image, if available.
            const displayImage =
              imageUrls.length > 0
                ? imageUrls[0]
                : "https://placehold.co/300x180/png";

            // Get booking info for this listing, if it exists.
            const bookingInfo = bookingsMap[listing.id] || {};
            const status = bookingInfo.status;
            // Disabled flag for booking if the listing is marked approved from the backend.
            const disabled = listing.approved;

            let actionButton;
            if (disabled) {
              actionButton = (
                <button disabled style={{ backgroundColor: "#ccc" }}>
                  Already Booked
                </button>
              );
            } else if (status) {
              const lowerStatus = status.toLowerCase();
              if (lowerStatus === "pending") {
                actionButton = (
                  <button
                    onClick={() => handleCancel(listing.id)}
                    style={{ backgroundColor: "#dc3545" }}
                  >
                    Cancel Request
                  </button>
                );
              } else if (
                lowerStatus === "terminated" ||
                lowerStatus === "declined" ||
                lowerStatus === "approved"
              ) {
                actionButton = (
                  <button disabled style={{ backgroundColor: "#ccc" }}>
                    {status}
                  </button>
                );
              } else {
                actionButton = (
                  <button onClick={() => handleBook(listing.id)}>
                    Book Now
                  </button>
                );
              }
            } else {
              actionButton = (
                <button onClick={() => handleBook(listing.id)}>
                  Book Now
                </button>
              );
            }

            return (
              <div key={listing.id} className="property-card">
                <img src={displayImage} alt={listing.title} />
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>
                  <strong>Location:</strong> {listing.location}
                </p>
                <p>
                  <strong>Price:</strong> ${listing.price}
                </p>
                <div className="amenities">
                  {Array.isArray(listing.amenities)
                    ? listing.amenities.map((a, idx) => (
                        <span key={idx} className="amenity-badge">
                          {a}
                        </span>
                      ))
                    : <span className="amenity-badge">{listing.amenities}</span>}
                </div>

                {/* Display booking status if booking info exists */}
                {status && (
                  <span className={`status-badge status-${status.toLowerCase()}`}>
                    {status}{" "}
                    {bookingInfo.bookingDate &&
                      `(on ${new Date(bookingInfo.bookingDate).toLocaleDateString()})`}
                  </span>
                )}

                {actionButton}

                <button
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  style={{ backgroundColor: "#007bff", marginLeft: "10px" }}
                >
                  View Details
                </button>
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

export default TenantDashboard;