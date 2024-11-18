import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';

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
    <div className="trip-dashboard">
      {error && <p className="error-message">{error}</p>}

      {/* Trip Cover Image */}
      <div className="trip-header">
        <img
          src={trip.coverImage || '/default-cover.jpg'}
          alt={`${trip.name} Cover`}
          className="trip-cover-image"
        />
        <div className="trip-title">
          <h1>{trip.name}</h1>
          <p className="trip-dates">
            {trip.startDate && trip.endDate
              ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(
                  trip.endDate
                ).toLocaleDateString()}`
              : 'No dates set'}
          </p>
          <p className="trip-location">
            <i className="location-icon" /> {trip.location || 'Location not specified'}
          </p>
          <p className="trip-description">{trip.description || 'No description available'}</p>
          <p className="trip-organizer">
            Organized by <strong>{trip.organizer?.name || 'Unknown'}</strong>
          </p>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="attendees-section">
        <h2>Attendees</h2>
        <div className="attendees-stats">
          <div>
            <strong>{trip.goingCount || 0}</strong> Going
          </div>
          <div>
            <strong>{trip.maybeCount || 0}</strong> Maybe
          </div>
          <div>
            <strong>{trip.invitedCount || 0}</strong> Invited
          </div>
        </div>
        <div className="attendees-avatars">
          {trip.attendees?.map((attendee, index) => (
            <img
              key={index}
              src={attendee.avatar || '/default-avatar.jpg'}
              alt={attendee.name}
              className="attendee-avatar"
            />
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="announcements-section">
        <h2>Announcements</h2>
        {trip.announcements?.length > 0 ? (
          trip.announcements.map((announcement, index) => (
            <div key={index} className="announcement">
              <div className="announcement-header">
                <img
                  src={announcement.user?.avatar || '/default-avatar.jpg'}
                  alt={announcement.user?.name || 'Unknown'}
                  className="announcement-user-avatar"
                />
                <span>{announcement.user?.name || 'Unknown'}</span>
                <span className="announcement-date">
                  {new Date(announcement.date).toLocaleString()}
                </span>
              </div>
              <p>{announcement.message}</p>
            </div>
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <button onClick={() => navigate(`/trip/${tripId}`)}>Trip Home</button>
        <button onClick={() => navigate(`/trip/${tripId}/plans`)}>Plans</button>
        <button onClick={() => navigate(`/trip/${tripId}/expenses`)}>Expenses</button>
        <button onClick={() => navigate(`/trip/${tripId}/messages`)}>Messages</button>
      </div>
    </div>
  );
};

export default TripDetails;
