import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/OwnerDashboard.css';
import { useNavigate } from 'react-router-dom';
import OwnerHeader from './OwnerHeader';

const BookingRequests = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await axios.get('https://onlinerps-backend.onrender.com/owner-booking-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookingRequests(response.data);
      } catch (error) {
        console.error('Error fetching booking requests:', error);
      }
    };

    fetchBookingRequests();
  }, [token]);

  const handleApprove = async (bookingId) => {
    try {
      await axios.put(`https://onlinerps-backend.onrender.com/approve-booking/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingRequests(prev =>
        prev.map(request =>
          request.booking_id === bookingId ? { ...request, status: 'Approved' } : request
        )
      );
      alert("Booking approved successfully.");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error approving booking.");
      }
      console.error("Error approving booking:", error);
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      await axios.put(`https://onlinerps-backend.onrender.com/decline-booking/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingRequests(prev =>
        prev.filter(request => request.booking_id !== bookingId)
      );
      alert("Booking declined successfully.");
    } catch (error) {
      alert("Error declining booking.");
      console.error("Error declining booking:", error);
    }
  };

  const handleTerminate = async (bookingId) => {
    try {
      await axios.put(`https://onlinerps-backend.onrender.com/terminate-booking/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingRequests(prev =>
        prev.map(request =>
          request.booking_id === bookingId ? { ...request, status: 'Terminated' } : request
        )
      );
      alert("Booking terminated successfully.");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Error terminating booking.");
      }
      console.error("Error terminating booking:", error);
    }
  };

  const handleViewTenant = (tenantDetails) => {
    setSelectedTenant(tenantDetails);
  };

  const closeModal = () => {
    setSelectedTenant(null);
  };

  return (
     <div className="dashboard-container">
          <OwnerHeader  />
    <div className="owner-dashboard">
      <h2>Booking Requests</h2>

      {bookingRequests.length === 0 ? (
        <p>No booking requests available.</p>
      ) : (
        bookingRequests.map((request) => (
          <div key={request.booking_id} className="booking-card">
            <div className="booking-details">
              <h3>{request.listing_title}</h3>
              <p><strong>Tenant:</strong> {request.tenant_name}</p>
              <p><strong>Booking Date:</strong> {new Date(request.booking_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </div>

            <div className="booking-actions">
              <button
                onClick={() =>
                  handleViewTenant({
                    name: request.tenant_name,
                    email: request.tenant_email,
                    phone: request.tenant_phone,
                  })
                }
              >
                View Tenant Details
              </button>
              {request.status.toLowerCase() === 'pending' && (
                <>
                  <button className="approve-button" onClick={() => handleApprove(request.booking_id)}>
                    Approve
                  </button>
                  <button className="decline-button" onClick={() => handleDecline(request.booking_id)}>
                    Decline
                  </button>
                </>
              )}
              {request.status.toLowerCase() === 'approved' && (
                <button className="terminate-button" onClick={() => handleTerminate(request.booking_id)}>
                  Terminate Booking
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {selectedTenant && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tenant Details</h3>
            <p><strong>Name:</strong> {selectedTenant.name}</p>
            <p><strong>Email:</strong> {selectedTenant.email}</p>
            <p><strong>Phone:</strong> {selectedTenant.phone}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
</div>
  );
};

export default BookingRequests;