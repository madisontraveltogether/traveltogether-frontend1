import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../css/TripDashboard.css';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';


const TripDetails = ({ currentUser }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await api.get(`/trips/${tripId}`);
        setTrip(response.data);
        setFormData(response.data);
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
      const response = await api.patch(`/trips/${tripId}`, formData);
      setTrip(response.data);
      setEditingField('');
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!trip) return <p>Loading...</p>;

  const isOrganizer = currentUser?.id === trip.organizer?.id;

  return (
    <div className="trip-dashboard">
      <TopBar title="Trip Home" />
      {error && <p className="error-message">{error}</p>}

      {/* Conditional rendering for cover image */}
      {trip.coverImage ? (
        <div className="trip-header">
          <img
            src={trip.coverImage}
            alt={`${trip.name} Cover`}
            className="trip-cover-image"
          />
        </div>
      ) : (
        <div className="trip-header no-image">
          <h2>No Cover Image</h2>
        </div>
      )}

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
          {trip.startDate && trip.endDate
            ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
            : 'No dates set'}
        </p>
        <p className="trip-location">
          {trip.location || 'Location not set'}
        </p>
        <p className="trip-description">
          {trip.description || 'No description provided.'}
        </p>
        <p className="trip-organizer">
          Organized by <strong>{trip.organizer?.name || 'Unknown'}</strong>
        </p>
      </div>

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
      </div>

      {/* Announcements Section */}
      <div className="announcements-section">
        <h3>Announcements</h3>
        {trip.announcements?.length > 0 ? (
          trip.announcements.map((announcement) => (
            <div
              key={announcement.id || announcement._id}
              className="announcement"
            >
              <p>{announcement.message || 'No announcement text.'}</p>
            </div>
          ))
        ) : (
          <p>No announcements yet.</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav tripId={tripId} />
      </div>
  );
};

export default TripDetails;
