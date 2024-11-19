import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../services/api'; // Assuming this sends a POST request to create a trip

const TripCreate = () => {
  const [name, setName] = useState(''); // Only trip name is required
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate trip name
    if (!name.trim()) {
      setError('Trip name is required');
      return;
    }

    try {
      // Make API call to create a trip with only the name
      const response = await createTrip({ name }); // Assuming the backend expects a single object with "name"

      // Navigate to the trip details page using the trip ID from the response
      navigate(`/trips/${response._id}`); // Assuming the response contains `_id` as the trip ID
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    }
  };

  return (
    <div>
      <TopBar title="Create a New Trip" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Trip Name (Required):
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter trip name"
            required
          />
        </label>
        <button type="submit">Create Trip</button>
      </form>
      <BottomNav />

    </div>
  );
};

export default TripCreate;
