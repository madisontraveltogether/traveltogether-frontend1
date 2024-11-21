import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDetails.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const isOrganizer = currentUser?.id === trip?.organizer?.id;

  useEffect(() => {
    fetchTripDetails();
    fetchNotifications();
  }, [retryCount]);

  const fetchTripDetails = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}`);
      setTrip(response.data);
      setEditForm(response.data);
    } catch (err) {
      setError('Failed to load trip details.');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}/notifications`);
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to load notifications.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/trips/${tripId}/invite`, { email });
      setEmail('');
      alert('Invitation sent!');
    } catch (err) {
      setError('Failed to send invitation.');
    }
  };

  const handleResendInvite = async (inviteEmail) => {
    try {
      await api.post(`/api/trips/${tripId}/invite`, { email: inviteEmail });
      alert('Invitation resent!');
    } catch (err) {
      alert('Failed to resend invitation.');
    }
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('coverPhoto', file);
      try {
        const response = await api.post(`/api/trips/${tripId}/cover`, formData);
        setTrip((prev) => ({ ...prev, coverImage: response.data.coverImage }));
      } catch (err) {
        alert('Failed to upload cover photo.');
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await api.patch(`/api/trips/${tripId}`, editForm);
      setTrip(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes.');
    }
  };

  const filterGuests = async (rsvpStatus) => {
    try {
      const response = await api.get(`/api/trips/${tripId}/guests/filter`, {
        params: { rsvpStatus },
      });
      setFilteredGuests(response.data);
    } catch (err) {
      alert('Failed to filter guests.');
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-details-page">
      <TopBar title="Trip Details" />

      {error && <p className="error-message">{error}</p>}

      {/* Cover Photo */}
      <div className="cover-photo">
        <img src={trip.coverImage || '/assets/default-trip-image.jpg'} alt="Trip Cover" />
        {isOrganizer && (
          <div className="cover-photo-upload">
            <input
              type="file"
              id="cover-photo"
              accept="image/*"
              onChange={handleCoverPhotoUpload}
            />
            <label htmlFor="cover-photo">Upload Cover Photo</label>
          </div>
        )}
      </div>

      {/* Trip Details */}
      <div className="trip-details">
        {isEditing ? (
          <div className="edit-form">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={editForm.name || ''}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={editForm.startDate?.split('T')[0] || ''}
                onChange={handleEditChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={editForm.endDate?.split('T')[0] || ''}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={editForm.location || ''}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editForm.description || ''}
                onChange={handleEditChange}
              />
            </label>
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <h1>{trip.name}</h1>
            <p>{trip.location}</p>
            <p>{trip.description}</p>
            <p>
              Dates: {new Date(trip.startDate).toLocaleDateString()} -{' '}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
            {isOrganizer && <button onClick={() => setIsEditing(true)}>Edit</button>}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="notifications-section">
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div key={index} className="notification">
              <p>{note.message}</p>
              <span>{new Date(note.date).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No notifications yet.</p>
        )}
      </div>

      {/* Pending Invites */}
      {isOrganizer && (
        <div className="invite-section">
          <h3>Pending Invites</h3>
          <form onSubmit={handleInvite}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
            <button type="submit">Invite</button>
          </form>
          <ul>
            {trip.pendingInvites.map((invite) => (
              <li key={invite}>
                {invite}
                <button onClick={() => handleResendInvite(invite)}>Resend</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="navigation-buttons">
        <button onClick={() => navigate(`/trips/${tripId}/tasks`)}>Tasks</button>
        <button onClick={() => navigate(`/trips/${tripId}/polls`)}>Polls</button>
        <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>Expenses</button>
      </div>

      <BottomNav />
    </div>
  );
};

export default TripDetails;
