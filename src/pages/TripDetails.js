import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [trip, setTrip] = useState({
    pendingInvites: [],
    attendees: [],
  });
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

      {/* Cover Photo */}
      <img
        src={trip.coverImage || '/assets/default-trip-image.jpg'}
        alt="Trip Cover"
        className="trip-banner"
      />


       {/* Trip Details */}
       <div className="trip-details">
        <span className="trip-dates">{`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`}</span>
        <h1 className="trip-title">{trip.name}</h1>
        <p className="trip-location">{trip.location}</p>
        <p className="trip-description">{trip.description}</p>
        <div className="trip-organizer">
          <img
            src={trip.organizer?.profileImage || '/assets/default-avatar.png'}
            alt={trip.organizer?.name}
          />
          <span>
            {trip.organizer?.name}
            {isOrganizer && <span className="organizer-badge">Organizer</span>}
          </span>
        </div>

        {/* Cover Photo Upload */}
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

      {/* Pending Invites */}
      {trip?.pendingInvites?.length > 0 ? (
  <ul className="pending-invites-list">
    {trip.pendingInvites.map((invite) => (
      <li key={invite}>
        {invite}
        <button onClick={() => handleResendInvite(invite)}>Resend</button>
      </li>
    ))}
  </ul>
) : (
  <p>No pending invites.</p>
)}

{trip?.attendees?.length > 0 ? (
  <ul className="attendees-list">
    {trip.attendees.map((attendee) => (
      <li key={attendee.id}>
        {attendee.name}
        <span className={`rsvp-status ${attendee.rsvpStatus?.toLowerCase()}`}>
          {attendee.rsvpStatus}
        </span>
      </li>
    ))}
  </ul>
) : (
  <p>No attendees yet.</p>
)}

      

{trip?.attendees?.length > 0 ? (
  <ul className="attendees-list">
    {trip.attendees.map((attendee) => (
      <li key={attendee.id}>
        {attendee.name}
        <span className={`rsvp-status ${attendee.rsvpStatus?.toLowerCase()}`}>
          {attendee.rsvpStatus}
        </span>
      </li>
    ))}
  </ul>
) : (
  <p>No attendees yet.</p>
)}


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

      {/* Attendees Section
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
      </div> */}

      <BottomNav tripId={tripId} />
    </div>
  );
};

export default TripDetails;
