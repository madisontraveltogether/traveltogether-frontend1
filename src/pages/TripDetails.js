import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [email, setEmail] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}`);
        setTrip(response.data);
        setAttendees(response.data.attendees || []);
        setRsvpStatus(response.data.attendees?.find((a) => a.userId === currentUser?.id)?.status || '');
      } catch (err) {
        setError('Failed to load trip details.');
      }
    };

    fetchTripDetails();
  }, [tripId, currentUser]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/trips/${tripId}/invite`, { email });
      setEmail(''); // Clear the form
      alert('Invitation sent!');
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
    }
  };

  const handleRsvpChange = async (status) => {
    try {
      await api.patch(`/api/trips/${tripId}/rsvp`, { status });
      setRsvpStatus(status); // Update local state
    } catch (err) {
      setError('Failed to update RSVP status.');
    }
  };

  if (!trip) return <p>Loading...</p>;

  const isOrganizer = currentUser?.id === trip.organizer?.id;

  return (
    <div className="trip-dashboard">
      <TopBar title="Trip Home" />
      {error && <p className="error-message">{error}</p>}

      {/* Trip Details */}
      <div className="trip-title">
        <h1>{trip.name}</h1>
        <p className="trip-dates">
          {trip.startDate && trip.endDate
            ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
            : 'No dates set'}
        </p>
        <p className="trip-location">{trip.location || 'Location not set'}</p>
        <p className="trip-description">{trip.description || 'No description provided.'}</p>
        <p className="trip-organizer">
          Organized by <strong>{trip.organizer?.name || 'Unknown'}</strong>
        </p>
      </div>

      {/* Attendees Section */}
      <div className="attendees-section">
        <h2>Attendees</h2>
        <ul className="attendees-list">
          {attendees.map((attendee) => (
            <li key={attendee.userId}>
              {attendee.name} - <strong>{attendee.status}</strong>
            </li>
          ))}
        </ul>

        {/* RSVP Section */}
        <div className="rsvp-section">
          <h3>Your RSVP</h3>
          <button
            onClick={() => handleRsvpChange('Going')}
            className={rsvpStatus === 'Going' ? 'active' : ''}
          >
            Going
          </button>
          <button
            onClick={() => handleRsvpChange('Maybe')}
            className={rsvpStatus === 'Maybe' ? 'active' : ''}
          >
            Maybe
          </button>
          <button
            onClick={() => handleRsvpChange('Not Going')}
            className={rsvpStatus === 'Not Going' ? 'active' : ''}
          >
            Not Going
          </button>
        </div>
      </div>

      {/* Invite Guests Section */}
      {isOrganizer && (
        <div className="invite-guests-section">
          <h3>Invite Guests</h3>
          <form onSubmit={handleInvite}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
            <button type="submit">Send Invite</button>
          </form>
        </div>
      )}

      {/* Announcements Section */}
      <div className="announcements-section">
        <h3>Announcements</h3>
        {trip.announcements?.length > 0 ? (
          trip.announcements.map((announcement) => (
            <div key={announcement.id || announcement._id} className="announcement">
              <p>{announcement.message || 'No announcement text.'}</p>
            </div>
          ))
        ) : (
          <p>No announcements yet.</p>
        )}
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
};

export default TripDetails;
