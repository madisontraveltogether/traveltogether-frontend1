import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/Itinerary.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const Itinerary = () => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState('');

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

  const handleVote = async (itemId, suggestionId) => {
    try {
      await api.post(`/trips/${tripId}/itinerary/${itemId}/suggestions/${suggestionId}/vote`);
      const updatedItinerary = itinerary.map((item) =>
        item._id === itemId
          ? {
              ...item,
              suggestions: item.suggestions.map((suggestion) =>
                suggestion._id === suggestionId
                  ? { ...suggestion, votes: suggestion.votes + 1 }
                  : suggestion
              ),
            }
          : item
      );
      setItinerary(updatedItinerary);
    } catch (err) {
      setError('Failed to vote on suggestion.');
    }
  };

  return (
    <div className="itinerary">
      <TopBar title="Itinerary" />
      {error && <p className="error">{error}</p>}
      <div className="itinerary-list">
        {itinerary.map((item) => (
          <div key={item._id} className="itinerary-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>
              {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
            </p>
            <div className="suggestions">
              <h4>Suggestions</h4>
              {item.suggestions.map((suggestion) => (
                <div key={suggestion._id} className="suggestion-item">
                  <p>{suggestion.name}</p>
                  <button onClick={() => handleVote(item._id, suggestion._id)}>Vote</button>
                  <p>Votes: {suggestion.votes}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />

    </div>
  );
};

export default Itinerary;
