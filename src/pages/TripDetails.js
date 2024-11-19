import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';

const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
        setFormData(response.data); // Initialize form data
      } catch (err) {
        setError('Failed to load trip details.');
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put(`/trips/${tripId}`, formData);
      setTrip(response.data); // Update trip data
      setEditingField(''); // Exit edit mode
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!trip) return <p>Loading...</p>;

  const isOrganizer = currentUser?.id === trip.organizer?.id; // Check if current user is the organizer

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
          <h1>
            {editingField === 'name' ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                onBlur={handleSave}
                disabled={saving}
              />
            ) : (
              <>
                {trip.name}
                {isOrganizer && (
                  <i
                    className="edit-icon"
                    onClick={() => setEditingField('name')}
                  >
                    ✏️
                  </i>
                )}
              </>
            )}
          </h1>
          <p className="trip-dates">
            {editingField === 'dates' ? (
              <>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  disabled={saving}
                />
                {' - '}
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  disabled={saving}
                />
                <button onClick={handleSave} disabled={saving}>
                  Save
                </button>
              </>
            ) : (
              <>
                {trip.startDate && trip.endDate
                  ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(
                      trip.endDate
                    ).toLocaleDateString()}`
                  : 'No dates set'}
                {isOrganizer && (
                  <i
                    className="edit-icon"
                    onClick={() => setEditingField('dates')}
                  >
                    ✏️
                  </i>
                )}
              </>
            )}
          </p>
          <p className="trip-location">
            {editingField === 'location' ? (
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                onBlur={handleSave}
                disabled={saving}
              />
            ) : (
              <>
                <i className="location-icon" /> {trip.location || 'Click to Edit'}
                {isOrganizer && (
                  <i
                    className="edit-icon"
                    onClick={() => setEditingField('location')}
                  >
                    ✏️
                  </i>
                )}
              </>
            )}
          </p>
          <p className="trip-description">
            {editingField === 'description' ? (
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                onBlur={handleSave}
                disabled={saving}
              />
            ) : (
              <>
                {trip.description || 'Click to Edit'}
                {isOrganizer && (
                  <i
                    className="edit-icon"
                    onClick={() => setEditingField('description')}
                  >
                    ✏️
                  </i>
                )}
              </>
            )}
          </p>
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
        <h3>Announcements</h3>
        {trip.announcements?.length > 0 ? (
          trip.announcements.map((announcement) => (
            <div key={announcement.id || announcement._id} className="announcement">
              <div className="announcement-header">
                <img src={announcement.user?.avatar || 'default-avatar.jpg'} alt={announcement.user?.name || 'Unknown user'} />
                <span>{announcement.user?.name || 'Unknown user'}</span>
                <span>{new Date(announcement.date || Date.now()).toLocaleString()}</span>
              </div>
              <p>{announcement.message || 'No message provided'}</p>
            </div>
          ))
        ) : (
          <p>No announcements yet.</p>
        )}
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