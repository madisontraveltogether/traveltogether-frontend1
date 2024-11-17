// src/pages/TripPolls.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TripPolls = () => {
  const { tripId } = useParams();
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/polls`);
        setPolls(response.data);
      } catch (err) {
        setError('Failed to load polls.');
      }
    };
    fetchPolls();
  }, [tripId]);

  const handleAddPoll = () => {
    navigate(`/trips/${tripId}/polls/new`);
  };

  return (
    <div>
      <h2>Trip Polls</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleAddPoll}>Create New Poll</button>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id} onClick={() => navigate(`/trips/${tripId}/polls/${poll._id}`)}>
            <h3>{poll.question}</h3>
            <p>Expires: {poll.expirationDate ? new Date(poll.expirationDate).toLocaleDateString() : 'No Expiration'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripPolls;
