import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    task: true,
    expense: true,
    itinerary: true,
    announcements: true,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
    }

    const fetchActivityLog = async () => {
      try {
        const response = await api.get('/auth/profile/activity-log');
        setActivityLog(response.data);
      } catch (err) {
        console.error('Error fetching activity log', err);
      }
    };

    const fetchNotificationPreferences = async () => {
      try {
        const response = await api.get('/auth/profile/notification-preferences');
        setNotificationPreferences(response.data);
      } catch (err) {
        console.error('Error fetching notification preferences', err);
      }
    };

    fetchActivityLog();
    fetchNotificationPreferences();
  }, [user]);

  const handleNotificationPreferenceChange = (type) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const saveNotificationPreferences = async () => {
    try {
      await api.patch('/auth/profile/notification-preferences', notificationPreferences);
      setMessage('Notification preferences updated successfully');
    } catch (err) {
      setError('Failed to update notification preferences');
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      if (!name.trim() || !email.trim() || !username.trim()) {
        throw new Error('Name, email, and username are required.');
      }
      const response = await api.patch('/auth/profile', { name, email, username });
      setUser(response.data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <TopBar title="Profile" />
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Profile Information */}
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>

      {/* Notification Preferences */}
      <h3>Notification Preferences</h3>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.task}
            onChange={() => handleNotificationPreferenceChange('task')}
          />
          Task Notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.expense}
            onChange={() => handleNotificationPreferenceChange('expense')}
          />
          Expense Notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.itinerary}
            onChange={() => handleNotificationPreferenceChange('itinerary')}
          />
          Itinerary Notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.announcements}
            onChange={() => handleNotificationPreferenceChange('announcements')}
          />
          Announcement Notifications
        </label>
      </div>
      <button onClick={saveNotificationPreferences}>Save Preferences</button>

      {/* Activity Log */}
      <h3>Recent Activity</h3>
      <ul>
        {activityLog.map((activity) => (
          <li key={activity.id}>
            {activity.action} on {new Date(activity.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
