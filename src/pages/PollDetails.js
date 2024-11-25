import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

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
        const response = await api.get(`/api/trips/${tripId}/polls/${pollId}`);
        setPoll(response.data);
      } catch (err) {
        setError('Failed to load poll. Please refresh the page.');
      }
    };

    fetchPoll();

    // WebSocket or polling for real-time updates
    const interval = setInterval(fetchPoll, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, [tripId, pollId]);

  const handleVote = async (optionId) => {
    try {
      await api.post(`/api/trips/${tripId}/polls/${pollId}/options/${optionId}/vote`);
      setVoteMessage('Vote recorded successfully!');
      setSelectedOption(optionId);

      // Fetch the updated poll after voting
      const response = await api.get(`/api/trips/${tripId}/polls/${pollId}`);
      setPoll(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote. Please try again.');
    }
  };

  const isPollExpired = poll && new Date(poll.expirationDate) < new Date();

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div>
      <TopBar title="Poll Details" />
      {error && <p className="error-message">{error}</p>}
      {voteMessage && <p className="success-message">{voteMessage}</p>}

      <h3>{poll.question}</h3>
      {isPollExpired ? (
        <p className="poll-expired-message">This poll has expired and voting is closed.</p>
      ) : (
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
      )}
      <button onClick={() => navigate(`/trips/${tripId}/polls`)}>Back to Polls</button>
      <BottomNav />
    </div>
  );
};

export default PollDetails;
