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
  const [activeTab, setActiveTab] = useState('itinerary'); // Switch between 'itinerary' and 'suggestions'

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
        <div className="empty-state">
          <img
            src={
              activeTab === 'itinerary'
                ? '/assets/itinerary-empty-icon.svg'
                : '/assets/suggestions-empty-icon.svg'
            }
            alt="Empty State"
            className="empty-icon"
          />
          <h3>{activeTab === 'itinerary' ? 'Adventure Awaits' : 'Got an Idea?'}</h3>
          <p>
            {activeTab === 'itinerary'
              ? 'Add your first event or suggest an event to start building your itinerary.'
              : 'Add suggestions so members can discuss and vote on events. Then, you can add your favorites to the itinerary.'}
          </p>
          <button
            className="add-btn"
            onClick={() =>
              navigate(
                activeTab === 'itinerary'
                  ? `/trips/${tripId}/itinerary/new`
                  : `/trips/${tripId}/itinerary/suggestions/new`
              )
            }
          >
            + {activeTab === 'itinerary' ? 'Add Event' : 'Add Suggestion'}
          </button>
        </div>
      ) : (
        <div className="itinerary-list">
          {itinerary.map((item, index) => (
            <div key={index} className="itinerary-card">
              <div className="itinerary-header">
                <span className="itinerary-day">Day {item.day}</span>
                <span className="itinerary-date">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <div className="itinerary-body">
                <img
                  src={item.image || '/assets/default-image.jpg'}
                  alt={item.title}
                  className="itinerary-image"
                />
                <div className="itinerary-details">
                  <h3>{item.title}</h3>
                  <p>Suggested by <strong>{item.suggestedBy}</strong></p>
                  <p>{item.description}</p>
                </div>
              </div>
              <div className="itinerary-footer">
                <span className="comments">0 Comments ↩️</span>
                <button className="vote-btn">👍</button>
                <button className="vote-btn">👎</button>
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
