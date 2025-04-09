import React from 'react';

const Filters = ({ filters, setFilters, applyFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filters">
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
      />
      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <input
        type="text"
        name="amenities"
        placeholder="Amenities (e.g. wifi, pool)"
        value={filters.amenities}
        onChange={handleChange}
      />
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;