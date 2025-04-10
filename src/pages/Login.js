import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css"; // Ensure this file is in your css folder

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in.
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("https://onlinerps-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }).toString(),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("accountType", data.accountType);

        if (data.accountType === "potential-renter") {
          navigate("/tenant-dashboard");
        } else if (data.accountType === "property-owner") {
          navigate("/owner-dashboard");
        } else {
          setError("Unknown account type. Please contact support.");
        }
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="signup-link">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;