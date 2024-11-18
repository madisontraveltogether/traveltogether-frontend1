import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../services/api'; // Assuming createTrip is your API function

const TripCreate = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [tripType, setTripType] = useState('vacation');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming the API function expects the trip data as an object
      const tripData = { name, location, description, startDate, endDate, privacy, tripType };
      const response = await createTrip(tripData);

      // Navigate to the trip details page after creating the trip
      navigate(`/trip/${response._id}`); // Assuming the response contains the trip ID as `_id`
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create a New Trip</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name (Required):
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Privacy:
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label>
          Trip Type:
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="vacation">Vacation</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
            <option value="adventure">Adventure</option>
          </select>
        </label>
        <button type="submit">Create Trip</button>
      </form>
    </div>
  );
};

export default TripCreate;
