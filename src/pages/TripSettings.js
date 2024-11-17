// src/pages/TripSettings.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TripSettings = () => {
  const { tripId } = useParams();
  const [settings, setSettings] = useState({
    isPrivate: false,
    notificationsEnabled: true,
    customTheme: 'default',
    maxGuests: 50,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Role-based editing

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/trips/${tripId}/settings`);
        setSettings(response.data);

        // Check if the user has edit permissions
        const roleResponse = await api.get(`/trips/${tripId}/role`);
        setCanEdit(roleResponse.data.canEdit);
      } catch (err) {
        setError('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [tripId]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.patch(`/trips/${tripId}/settings`, { settings });
      setMessage('Settings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateMaxGuests = (value) => {
    if (value < 1) {
      setError('Max guests must be at least 1.');
      return;
    }
    setError('');
    setSettings({ ...settings, maxGuests: parseInt(value, 10) });
  };

  if (isLoading) return <p>Loading settings...</p>;

  return (
    <div>
      <h2>Trip Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <label>
        Private Trip:
        <input
          type="checkbox"
          checked={settings.isPrivate}
          onChange={(e) => setSettings({ ...settings, isPrivate: e.target.checked })}
          disabled={!canEdit}
        />
      </label>

      <label>
        Enable Notifications:
        <input
          type="checkbox"
          checked={settings.notificationsEnabled}
          onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
          disabled={!canEdit}
        />
      </label>

      <label>
        Theme:
        <select
          value={settings.customTheme}
          onChange={(e) => setSettings({ ...settings, customTheme: e.target.value })}
          disabled={!canEdit}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <label>
        Max Guests:
        <input
          type="number"
          value={settings.maxGuests}
          onChange={(e) => validateMaxGuests(e.target.value)}
          disabled={!canEdit}
        />
      </label>

      {canEdit && <button onClick={handleSave}>Save Settings</button>}
    </div>
  );
};

export default TripSettings;
