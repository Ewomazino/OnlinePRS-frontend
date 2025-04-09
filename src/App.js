import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Public Pages
import LandingPage from "./pages/LandingPage";
import ListingsPage from "./pages/ListingsPage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";

// Protected Pages (Wrapped in PrivateRoute)
import Profile from "./components/Profile";
import OwnerDashboard from "./components/OwnerDashboard";
import BookingRequests from "./components/BookingRequests";
import CreateListing from "./components/CreateListing";
import EditListing from "./components/EditListing";
import TenantDashboard from "./components/TenantDashboard";
import MyBookings from "./components/MyBookings";
import ListingDetails from "./components/ListingDetails";

// Public listing details component
import PublicListingDetails from "./pages/PublicListingDetails";

// 404 Not Found Page
import NotFound from "./pages/NotFound";

// Auth wrapper for route security
import PrivateRoute from "./auth/PrivateRoute";

// Global CSS files
import "./css/style.css";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes accessible by authenticated users */}
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedTypes={["property-owner", "potential-renter"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Protected Routes for property owners */}
        <Route
          path="/owner-dashboard"
          element={
            <PrivateRoute allowedTypes={["property-owner"]}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking-requests"
          element={
            <PrivateRoute allowedTypes={["property-owner"]}>
              <BookingRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-listing"
          element={
            <PrivateRoute allowedTypes={["property-owner"]}>
              <CreateListing />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-listing/:id"
          element={
            <PrivateRoute allowedTypes={["property-owner"]}>
              <EditListing />
            </PrivateRoute>
          }
        />

        {/* Protected Routes for potential renters */}
        <Route
          path="/tenant-dashboard"
          element={
            <PrivateRoute allowedTypes={["potential-renter"]}>
              <TenantDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute allowedTypes={["potential-renter"]}>
              <MyBookings />
            </PrivateRoute>
          }
        />

        {/* Protected Route for Listing Details (both roles) */}
        <Route
          path="/listing/:listingId"
          element={
            <PrivateRoute allowedTypes={["property-owner", "potential-renter"]}>
              <ListingDetails />
            </PrivateRoute>
          }
        />

        {/* Public Listing Details for non-authenticated users */}
        <Route path="/public-listing/:listingId" element={<PublicListingDetails />} />

        {/* 404 Not Found - catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;