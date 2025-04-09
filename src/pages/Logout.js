import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the server-side logout endpoint.
        // Adjust the URL and HTTP method as needed.
        await axios.post(
          "https://online-rps-backend.vercel.app/logout",
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        );
      } catch (error) {
        console.error("Error during server logout:", error);
      } finally {
        // Remove stored authentication tokens and user data.
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData"); // Remove additional user data if stored.
        // Redirect to the login page.
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;