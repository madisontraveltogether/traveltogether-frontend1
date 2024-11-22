import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const JoinTripPage = ({ currentUser }) => {
  const [tripCode, setTripCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinTrip = async () => {
    try {
      const response = await api.post('/api/trips/join', { tripCode, userId: currentUser.id });
      alert('You have successfully joined the trip!');
      navigate(`/trips/${response.data.tripId}`);
    } catch (err) {
      setError('Invalid trip code or unable to join trip.');
    }
  };

  return (
    <div className="join-trip-page">
      <h1>Join a Trip</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        value={tripCode}
        onChange={(e) => setTripCode(e.target.value)}
        placeholder="Enter trip code"
      />
      <button onClick={handleJoinTrip}>Join Trip</button>
    </div>
  );
};

export default JoinTripPage;
