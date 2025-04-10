import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header"; // Assume a reusable header component
import { useNavigate } from "react-router-dom";
import "../css/Profile.css"; // Create this CSS file for profile styles if needed

const Profile = () => {
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    account_type: "",
    phone: ""
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://onlinerps-backend.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched profile:", response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone
      };
      const response = await axios.put("https://onlinerps-backend.onrender.com/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setMessage(response.data.message);
      // Optionally, navigate to another page
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Header links={[{ label: "Home", url: "/home" }, { label: "Profile", url: "/profile" }]} onLogout={() => { localStorage.removeItem("authToken"); navigate("/login"); }} />
      <div className="profile-container">
        <h2>Your Profile</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              required
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;