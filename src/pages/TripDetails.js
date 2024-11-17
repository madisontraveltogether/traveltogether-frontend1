// src/pages/TripDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
      } catch (err) {
        setError('Failed to load trip details.');
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-details">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Trip Cover Image */}
      <div className="trip-cover">
        <img src={trip.coverImage || 'default-image.jpg'} alt={trip.name} className="cover-image" />
      </div>

      {/* Trip Title, Date, Location */}
      <div className="trip-header">
        <h2>{trip.name}</h2>
        <p>
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
        <p>{trip.location}</p>
        <p>{trip.description}</p>
        <p>Organized by <strong>{trip.organizer.name}</strong></p>
      </div>

      {/* Attendees Section */}
      <div className="attendees-section">
        <h3>Attendees</h3>
        <div className="attendee-counts">
          <div className="going">
            <strong>{trip.goingCount}</strong> Going
          </div>
          <div className="maybe">
            <strong>{trip.maybeCount}</strong> Maybe
          </div>
          <div className="invited">
            <strong>{trip.invitedCount}</strong> Invited
          </div>
        </div>
        <div className="attendee-avatars">
          {trip.attendees.map(attendee => (
            <img src={attendee.avatar || 'default-avatar.jpg'} alt={attendee.name} key={attendee.id} />
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="announcements-section">
        <h3>Announcements</h3>
        {trip.announcements.map((announcement) => (
          <div key={announcement.id} className="announcement">
            <div className="announcement-header">
              <img src={announcement.user.avatar || 'default-avatar.jpg'} alt={announcement.user.name} />
              <span>{announcement.user.name}</span>
              <span>{new Date(announcement.date).toLocaleString()}</span>
            </div>
            <p>{announcement.message}</p>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button onClick={() => navigate(`/trips/${tripId}`)}>Trip Home</button>
        <button onClick={() => navigate(`/trips/${tripId}/plans`)}>Plans</button>
        <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>Expenses</button>
        <button onClick={() => navigate(`/trips/${tripId}/messages`)}>Messages</button>
      </div>
    </div>
  );
};

export default TripDetails;
