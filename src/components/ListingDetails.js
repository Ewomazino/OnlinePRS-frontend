import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";   // Reusable header component
import { useParams } from "react-router-dom";
import "../css/ListingDetails.css"; // Custom CSS for listing details and gallery

// Helper function to process image_url data into a flat array of URLs.
const processImageUrls = (imageData) => {
  if (!imageData) return [];

  // If imageData is a string, assume comma-separated
  if (typeof imageData === "string") {
    return imageData.split(",").map(url => url.trim()).filter(url => url.length > 0);
  }

  // If imageData is an array, check if the first element is also an array (nested arrays)
  if (Array.isArray(imageData)) {
    if (imageData.length > 0 && Array.isArray(imageData[0])) {
      // Flatten using flat() (ES2019+). If flat() isn't available, you could use reduce.
      return imageData.flat().map(url => url.trim()).filter(url => url.length > 0);
    } else {
      return imageData.map(url => (typeof url === "string" ? url.trim() : ""))
                       .filter(url => url.length > 0);
    }
  }

  return [];
};

const ListingDetails = () => {
  const { listingId } = useParams();
  const token = localStorage.getItem("authToken");
  const [listing, setListing] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  // State for the contact form message
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://online-rps-backend.vercel.app/listing-details?listingId=${listingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // If the API returns an array, extract the first element.
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log("Fetched listing data:", data);
        setListing(data);
        // Process image URLs and set default display image as first URL
        const urls = processImageUrls(data.image_url);
        if (urls.length > 0) {
          setDisplayImage(urls[0]);
        }
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };

    fetchListing();
  }, [listingId, token]);

  if (!listing) {
    return <p>Loading listing details...</p>;
  }

  // Process the image_url into an array for thumbnail display.
  const imageUrls = processImageUrls(listing.image_url);
  console.log("Processed image URLs:", imageUrls);

  // Event handler for contact form submission.
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry about ${listing.title}`);
    const body = encodeURIComponent(contactMessage);
    const mailtoLink = `mailto:${listing.landlord.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="listing-details-container">
      <Header />
      <div className="listing-details">
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Price:</strong> ${listing.price}</p>
        
        <div className="gallery">
          {/* Main display image */}
          <div className="main-image">
            <img src={displayImage || "https://placehold.co/300x180/png"} alt={listing.title} className="gallery-thumbnail" />
          </div>
          {/* Thumbnails row */}
          {imageUrls.length > 1 && (
            <div className="thumbnails-row">
              {imageUrls.map((url, index) => (
                <img 
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${url === displayImage ? "active" : ""}`}
                  onClick={() => setDisplayImage(url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="contact-owner">
          <h3>Contact Property Owner</h3>
          <p>
            <strong>Name:</strong> {listing.landlord.name} <br />
            <strong>Email:</strong> {listing.landlord.email}
          </p>
          <form onSubmit={handleContactSubmit}>
            <textarea 
              placeholder="Type your message here..." 
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Send Email</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;