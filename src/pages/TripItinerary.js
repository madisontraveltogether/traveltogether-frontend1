import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import '../css/Itinerary.css';

const Itinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}/itinerary`);
        setItinerary(response.data);
      } catch (err) {
        setError('Failed to load itinerary.');
      }
    };

    fetchItinerary();
  }, [tripId]);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/trips/${tripId}/itinerary/${itemId}`);
        setItinerary(itinerary.filter((item) => item._id !== itemId));
      } catch (err) {
        setError('Failed to delete the itinerary item.');
      }
    }
  };

  return (
    <div className="itinerary-page">
      <TopBar title="Itinerary" />
      {error && <p className="error">{error}</p>}

      {itinerary.length === 0 ? (
        <div className="empty-state">
          <img src="/assets/itinerary-empty-icon.svg" alt="Empty Itinerary" />
          <h3>Adventure Awaits</h3>
          <p>Add your first event to start building your itinerary.</p>
          <button
            className="add-btn"
            onClick={() => navigate(`/trips/${tripId}/itinerary/new`)}
          >
            + Add Event
          </button>
        </div>
      ) : (
        <div className="itinerary-list">
          {itinerary.map((item) => (
            <div key={item._id} className="itinerary-card">
              <div className="itinerary-header">
                <span>{item.title}</span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
              <div className="itinerary-body">
                <div className="itinerary-details">
                  <p>{item.description}</p>
                  <p>
                    {item.startTime && new Date(item.startTime).toLocaleString()} -{' '}
                    {item.endTime && new Date(item.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Itinerary;
