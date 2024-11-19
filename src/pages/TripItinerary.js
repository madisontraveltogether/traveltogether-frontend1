import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/Itinerary.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const Itinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary'); // "itinerary" or "suggestions"

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/itinerary`);
        setItinerary(response.data);
      } catch (err) {
        setError('Failed to load itinerary.');
      }
    };

    fetchItinerary();
  }, [tripId]);

  const renderEmptyState = () => {
    if (activeTab === 'itinerary') {
      return (
        <div className="empty-state">
          <img
            src="/assets/itinerary-empty-icon.svg"
            alt="Adventure Awaits"
            className="empty-icon"
          />
          <h3>Adventure Awaits</h3>
          <p>
            Add your first event or suggest an event to start building your
            itinerary.
          </p>
          <button
            className="add-event-btn"
            onClick={() => navigate(`/trips/${tripId}/itinerary/new`)}
          >
            + Add Event
          </button>
        </div>
      );
    }

    if (activeTab === 'suggestions') {
      return (
        <div className="empty-state">
          <img
            src="/assets/suggestions-empty-icon.svg"
            alt="Got an Idea?"
            className="empty-icon"
          />
          <h3>Got an Idea?</h3>
          <p>
            Add suggestions so members can discuss and vote on events. Then, you
            can add your favorites to the itinerary.
          </p>
          <button
            className="add-suggestion-btn"
            onClick={() => navigate(`/trips/${tripId}/itinerary/suggestions/new`)}
          >
            + Add Suggestion
          </button>
        </div>
      );
    }
  };

  return (
    <div className="itinerary-page">
      <TopBar title={activeTab === 'itinerary' ? 'Itinerary' : 'Suggestions'} />
      <div className="tabs">
        <button
          className={activeTab === 'itinerary' ? 'active' : ''}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        <button
          className={activeTab === 'suggestions' ? 'active' : ''}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {itinerary.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="itinerary-list">
          {activeTab === 'itinerary' &&
            itinerary.map((item) => (
              <div key={item._id} className="itinerary-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>
                  {new Date(item.startTime).toLocaleString()} -{' '}
                  {new Date(item.endTime).toLocaleString()}
                </p>
              </div>
            ))}
          {activeTab === 'suggestions' &&
            itinerary.flatMap((item) =>
              item.suggestions.map((suggestion) => (
                <div key={suggestion._id} className="suggestion-item">
                  <h3>{suggestion.name}</h3>
                  <p>{suggestion.description}</p>
                  <button
                    onClick={() =>
                      handleVote(item._id, suggestion._id)
                    }
                  >
                    Vote
                  </button>
                  <p>Votes: {suggestion.votes}</p>
                </div>
              ))
            )}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Itinerary;
