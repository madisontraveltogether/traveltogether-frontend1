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
  const [tripDates, setTripDates] = useState([]); // Store trip dates

  // Fetch itinerary and trip details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trip details to get tripDates
        const tripResponse = await api.get(`/api/trips/${tripId}`);
        setTripDates(tripResponse.data.tripDates || []);

        // Fetch itinerary items
        const itineraryResponse = await api.get(`/api/trips/${tripId}/itinerary`);
        setItinerary(itineraryResponse.data);
      } catch (err) {
        setError('Failed to load itinerary or trip details.');
      }
    };

    fetchData();
  }, [tripId]);

  // Group itinerary items by day
  const groupItineraryItems = (items) => {
    return items.reduce((groups, item) => {
      const day = item.day || "Unscheduled";
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(item);
      return groups;
    }, {});
  };

  const sortedGroupedItinerary = groupItineraryItems(
    itinerary.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  );

  // Handle deleting an item
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/trips/${tripId}/itinerary/${itemId}`);
        setItinerary((prev) => prev.filter((item) => item._id !== itemId));
      } catch (err) {
        console.error(err); // Log errors to debug
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
            onClick={() =>
              navigate(`/trips/${tripId}/itinerary/new`, { state: { tripDates } })
            }
          >
            + Add Event
          </button>
        </div>
      ) : (
        <div className="itinerary-list">
          {Object.entries(sortedGroupedItinerary).map(([day, items]) => (
            <div key={day} className="itinerary-group">
              <h2 className="itinerary-day-header">{day}</h2>
              {items.map((item) => (
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
                      <p>{item.description || 'No description provided.'}</p>
                      <p>
                        {item.startTime &&
                          new Date(item.startTime).toLocaleString()} -{' '}
                        {item.endTime &&
                          new Date(item.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Itinerary;
