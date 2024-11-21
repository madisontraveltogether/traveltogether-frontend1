import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [email, setEmail] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  const isOrganizer = currentUser?.id === trip?.organizer?.id;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/api/trips/${tripId}`);
        setTrip(response.data);
        setAttendees(response.data.attendees || []);
        setRsvpStatus(
          response.data.attendees?.find((a) => a.userId === currentUser?.id)?.status || ''
        );
        setEditForm(response.data); // Initialize the form with existing trip data
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await api.patch(`/api/trips/${tripId}`, editForm);
      setTrip(response.data); // Update trip details
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-dashboard">
      <TopBar title="Trip Home" />

      {error && <p className="error-message">{error}</p>}

      {/* Trip Details Section */}
      <div className="trip-details">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Trip Name"
              required
            />
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleEditChange}
              placeholder="Location"
            />
            <input
              type="date"
              name="startDate"
              value={editForm.startDate?.slice(0, 10)}
              onChange={handleEditChange}
            />
            <input
              type="date"
              name="endDate"
              value={editForm.endDate?.slice(0, 10)}
              onChange={handleEditChange}
            />
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <button onClick={handleSaveChanges} className="save-btn">
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <h1>{trip.name}</h1>
            <p>
              {trip.startDate && trip.endDate
                ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(
                    trip.endDate
                  ).toLocaleDateString()}`
                : 'No dates set'}
            </p>
            <p>{trip.location || 'Location not set'}</p>
            <p>{trip.description || 'No description provided.'}</p>
            <p>
              Organized by <strong>{trip.organizer?.name || 'Unknown'}</strong>
            </p>
            {isOrganizer && (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Trip
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div className="trip-navigation">
        <button onClick={() => navigate(`/trips/${tripId}/tasks`)}>Tasks</button>
        <button onClick={() => navigate(`/trips/${tripId}/polls`)}>Polls</button>
        <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>Expenses</button>
        <button onClick={() => navigate(`/trips/${tripId}/messages`)}>Messages</button>
        <button onClick={() => navigate(`/trips/${tripId}/announcements`)}>
          Announcements
        </button>
      </div>

      {/* Attendees Section */}
      <div className="attendees-section">
        <h2>Attendees</h2>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.userId}>
              {attendee.name} - <strong>{attendee.status}</strong>
            </li>
          ))}
        </ul>

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
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
};

export default TripDetails;
