import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
      const response = await api.put(`/trips/${tripId}`, formData);
      setTrip(response.data); // Update with the saved data
      setEditingField(''); // Exit edit mode
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-details">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Trip Name */}
      <div>
        <h2>
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
            <span onClick={() => setEditingField('name')}>{trip.name || 'Click to Edit'}</span>
          )}
        </h2>
      </div>

      {/* Trip Description */}
      <div>
        <p>
          {editingField === 'description' ? (
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              onBlur={handleSave}
              disabled={saving}
            />
          ) : (
            <span onClick={() => setEditingField('description')}>
              {trip.description || 'Click to Edit'}
            </span>
          )}
        </p>
      </div>

      {/* Other Fields */}
      <div>
        <label>
          Start Date:
          {editingField === 'startDate' ? (
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleInputChange}
              onBlur={handleSave}
              disabled={saving}
            />
          ) : (
            <span onClick={() => setEditingField('startDate')}>
              {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Click to Edit'}
            </span>
          )}
        </label>
      </div>

      <div>
        <label>
          End Date:
          {editingField === 'endDate' ? (
            <input
              type="date"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleInputChange}
              onBlur={handleSave}
              disabled={saving}
            />
          ) : (
            <span onClick={() => setEditingField('endDate')}>
              {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'Click to Edit'}
            </span>
          )}
        </label>
      </div>

      {/* Privacy */}
      <div>
        <label>
          Privacy:
          {editingField === 'privacy' ? (
            <select
              name="privacy"
              value={formData.privacy || 'private'}
              onChange={handleInputChange}
              onBlur={handleSave}
              disabled={saving}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          ) : (
            <span onClick={() => setEditingField('privacy')}>{trip.privacy}</span>
          )}
        </label>
      </div>
    </div>
  );
};

export default TripDetails;