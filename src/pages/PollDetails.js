// src/pages/PollDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PollDetails = () => {
  const { tripId, pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');
  const [voteMessage, setVoteMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/polls/${pollId}`);
        setPoll(response.data);
      } catch (err) {
        setError('Failed to load poll.');
      }
    };
    fetchPoll();
  }, [tripId, pollId]);

  const handleVote = async (optionId) => {
    try {
      await api.post(`/trips/${tripId}/polls/${pollId}/options/${optionId}/vote`);
      setVoteMessage('Vote recorded successfully!');
      setSelectedOption(optionId);

      // Optionally refetch poll to update vote counts
      const response = await api.get(`/trips/${tripId}/polls/${pollId}`);
      setPoll(response.data);
    } catch (err) {
      setError('Failed to cast vote.');
    }
  };

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div>
      <h2>Poll Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {voteMessage && <p style={{ color: 'green' }}>{voteMessage}</p>}
      <h3>{poll.question}</h3>
      <ul>
        {poll.options.map((option) => (
          <li key={option._id}>
            <button onClick={() => handleVote(option._id)} disabled={selectedOption === option._id}>
              {option.text} ({option.votes.length} votes)
              {selectedOption === option._id && ' (Your Vote)'}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/trips/${tripId}/polls`)}>Back to Polls</button>
    </div>
  );
};

export default PollDetails;
