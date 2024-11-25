import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/Polls.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripPolls = () => {
  const { tripId } = useParams();
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/polls`);
        setPolls(response.data);
      } catch (err) {
        setError('Failed to load polls. Please try again later.');
      }
    };
    fetchPolls();
  }, [tripId]);

  const handleAddPoll = () => {
    navigate(`/trips/${tripId}/polls/new`);
  };

  const renderPollStatus = (poll) => {
    const isExpired = new Date(poll.expirationDate) < new Date();
    return isExpired ? <span className="poll-expired">Expired</span> : <span className="poll-active">Active</span>;
  };

  return (
    <div className="polls-container">
      <TopBar title="Polls" />
      {error && <p className="error-message">{error}</p>}

      <button className="add-poll-button" onClick={handleAddPoll}>
        Create New Poll
      </button>

      {polls.length === 0 ? (
        <p className="no-polls-message">No polls created yet.</p>
      ) : (
        <ul className="poll-list">
          {polls.map((poll) => (
            <li
              key={poll._id}
              className="poll-card"
              onClick={() => navigate(`/trips/${tripId}/polls/${poll._id}`)}
            >
              <h3 className="poll-question">{poll.question}</h3>
              <p className="poll-meta">
                {renderPollStatus(poll)} | Expires: {poll.expirationDate ? new Date(poll.expirationDate).toLocaleDateString() : 'No Expiration'}
              </p>
              <button
                className="share-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${window.location.origin}/trips/${tripId}/polls/${poll._id}`);
                  alert('Poll link copied to clipboard!');
                }}
              >
                Share Poll
              </button>
            </li>
          ))}
        </ul>
      )}
      <BottomNav />
    </div>
  );
};

export default TripPolls;
