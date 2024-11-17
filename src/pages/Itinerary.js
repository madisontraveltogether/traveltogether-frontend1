// src/pages/Itinerary.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Itinerary = () => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', location: '', startTime: '', endTime: '' });
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

  const handleAddItem = async () => {
    try {
      const response = await api.post(`/trips/${tripId}/itinerary`, newItem);
      setItinerary([...itinerary, response.data]);
      setNewItem({ title: '', description: '', location: '', startTime: '', endTime: '' });
    } catch (err) {
      setError('Failed to add itinerary item.');
    }
  };

  const handleAddSuggestion = async (itemId, suggestionData) => {
    try {
      const response = await api.post(`/trips/${tripId}/itinerary/${itemId}/suggestions`, suggestionData);
      const updatedItinerary = itinerary.map(item =>
        item._id === itemId ? { ...item, suggestions: [...item.suggestions, response.data] } : item
      );
      setItinerary(updatedItinerary);
    } catch (err) {
      setError('Failed to add suggestion.');
    }
  };

  const handleVoteOnSuggestion = async (itemId, suggestionId) => {
    try {
      await api.post(`/trips/${tripId}/itinerary/${itemId}/suggestions/${suggestionId}/vote`);
      // Update the vote count in the UI
      const updatedItinerary = itinerary.map(item =>
        item._id === itemId
          ? {
              ...item,
              suggestions: item.suggestions.map(suggestion =>
                suggestion._id === suggestionId
                  ? { ...suggestion, votes: [...suggestion.votes, 'userId'] } // Add userId to votes
                  : suggestion
              )
            }
          : item
      );
      setItinerary(updatedItinerary);
    } catch (err) {
      setError('Failed to vote on suggestion.');
    }
  };

  return (
    <div>
      <h2>Itinerary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="Title"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newItem.location}
          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={newItem.startTime}
          onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={newItem.endTime}
          onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <ul>
        {itinerary.map(item => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Location: {item.location}</p>
            <p>
              {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
            </p>
            <h4>Suggestions</h4>
            {item.suggestions.map(suggestion => (
              <div key={suggestion._id}>
                <p>
                  Suggested by: {suggestion.user}, Date: {new Date(suggestion.date).toLocaleDateString()}
                </p>
                <button onClick={() => handleVoteOnSuggestion(item._id, suggestion._id)}>Vote</button>
                <p>Votes: {suggestion.votes.length}</p>
              </div>
            ))}
            <button onClick={() => handleAddSuggestion(item._id, { date: new Date(), time: '12:00', votingCutoff: new Date() })}>
              Add Suggestion
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Itinerary;
