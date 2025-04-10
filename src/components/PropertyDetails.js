import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://onlinerps-backend.onrender.com/listings/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="property-details">
      <h2>{property.title}</h2>
      <img src={property.image_url || "/placeholder.jpg"} alt={property.title} />
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Price:</strong> ${property.price} / month</p>
      <p><strong>Amenities:</strong> {property.amenities}</p>
      <p><strong>Description:</strong> {property.description}</p>
      <button>Request to Book</button>
    </div>
  );
};

export default PropertyDetails;