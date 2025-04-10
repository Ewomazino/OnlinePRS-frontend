import React, { useState } from "react";
import axios from "axios";
import OwnerHeader from "./OwnerHeader";
import { useNavigate } from "react-router-dom";
import "../css/OwnerDashboard.css";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState([]); // stores multiple image files
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    // Convert FileList to an array
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("amenities", amenities);
    // Append each image file to the formData using the same key "images"
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post("https://onlinerps-backend.onrender.com/create-listing", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not explicitly set Content-Type; the browser will set the proper multipart boundary.
        },
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating listing.");
      console.error("Error creating listing:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <OwnerHeader />
      <div className="create-listing-form" style={{ marginTop: "20px" }}>
        <h2>Create New Listing</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            ></textarea>
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input 
              type="number" 
              step="0.01"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Amenities:</label>
            <input 
              type="text" 
              value={amenities} 
              onChange={(e) => setAmenities(e.target.value)} 
              placeholder="Comma separated list"
            />
          </div>
          <div className="form-group">
            <label>Upload Images:</label>
            <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={handleImageChange} 
            />
          </div>
          <button type="submit">Create Listing</button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;