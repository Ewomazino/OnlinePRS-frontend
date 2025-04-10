import React, { useEffect, useState } from "react";
import axios from "axios";
import OwnerHeader from "./OwnerHeader";
import { useParams, useNavigate } from "react-router-dom";
import "../css/OwnerDashboard.css";

const EditListing = () => {
  const { id } = useParams(); // listing id from the URL
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  
  // Initialize the state with default values
  const [listing, setListing] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    amenities: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`https://onlinerps-backend.onrender.com/listings?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched listing:", response.data);
        // Check if response.data is an object (or first element if it's an array)
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        setListing({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          price: data.price || "",
          amenities: data.amenities || "",
          image_url: data.image_url || ""
        });
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    fetchListing();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://onlinerps-backend.onrender.com/edit-listing/${id}`,
        {
          title: listing.title,
          description: listing.description,
          location: listing.location,
          price: listing.price,
          amenities: listing.amenities,
          image_url: listing.image_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Listing updated successfully!");
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error updating listing.");
      console.error("Error updating listing:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <OwnerHeader />
      <div className="create-listing-form" style={{ marginTop: "20px" }}>
        <h2>Edit Listing</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input 
              type="text" 
              value={listing.title} 
              onChange={(e) => setListing({ ...listing, title: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              value={listing.description} 
              onChange={(e) => setListing({ ...listing, description: e.target.value })}
              required 
            ></textarea>
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input 
              type="text" 
              value={listing.location} 
              onChange={(e) => setListing({ ...listing, location: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input 
              type="number" 
              step="0.01"
              value={listing.price} 
              onChange={(e) => setListing({ ...listing, price: e.target.value })}
              required 
            />
          </div>
          <div className="form-group">
            <label>Amenities:</label>
            <input 
              type="text" 
              value={listing.amenities} 
              onChange={(e) => setListing({ ...listing, amenities: e.target.value })}
              placeholder="Comma separated list"
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input 
              type="text" 
              value={listing.image_url} 
              onChange={(e) => setListing({ ...listing, image_url: e.target.value })}
            />
          </div>
          <button type="submit">Update Listing</button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;