import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css"; // Updated CSS file

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "",
    phone: "",
  });

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const accountType = localStorage.getItem("accountType");
    if (token && accountType) {
      if (accountType === "potential-renter") {
        navigate("/tenant-dashboard");
      } else if (accountType === "property-owner") {
        navigate("/owner-dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/register", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="phone" 
              name="phone" 
              placeholder="Phone" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <select name="accountType" onChange={handleChange} required>
              <option value="">Select Account Type</option>
              <option value="property-owner">Property Owner</option>
              <option value="potential-renter">Potential Renter</option>
            </select>
          </div>
          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;