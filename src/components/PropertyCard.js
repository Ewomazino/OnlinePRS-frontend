import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div className="property-card" onClick={() => navigate(`/listing/${property.id}`)}>
      <img src={property.image_url || '/placeholder.jpg'} alt={property.title} />
      <h3>{property.title}</h3>
      <p>{property.location}</p>
      <p>${property.price} / month</p>
    </div>
  );
};

export default PropertyCard;