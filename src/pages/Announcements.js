// src/pages/Announcements.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Announcements = () => {
  const { tripId } = useParams();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('guest'); // Default role

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/announcements`);
        setAnnouncements(response.data);
      } catch (err) {
        setError('Failed to load announcements.');
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await api.get(`/trips/${tripId}/user-role`);
        setUserRole(response.data.role);
      } catch (err) {
        console.error('Failed to fetch user role.');
      }
    };

    fetchAnnouncements();
    fetchUserRole();
  }, [tripId]);

  const handleNewAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      const response = await api.post(`/trips/${tripId}/announcements`, {
        message: newAnnouncement,
      });
      setAnnouncements([response.data, ...announcements]);
      setNewAnnouncement('');
    } catch (err) {
      setError('Failed to create announcement.');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await api.delete(`/trips/${tripId}/announcements/${announcementId}`);
      setAnnouncements(announcements.filter((announcement) => announcement._id !== announcementId));
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  return (
    <div className="announcements">
      <h2>Announcements</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* New Announcement Input */}
      {(userRole === 'organizer' || userRole === 'collaborator') && (
        <div className="new-announcement">
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Write a new announcement..."
          />
          <button onClick={handleNewAnnouncement}>Post Announcement</button>
        </div>
      )}

      {/* Announcements List */}
      <ul className="announcement-list">
        {announcements.map((announcement) => (
          <li key={announcement._id} className="announcement-item">
            <div className="announcement-header">
              <img
                src={announcement.user.avatar || '/default-avatar.jpg'}
                alt={announcement.user.name}
                className="announcement-avatar"
              />
              <div>
                <strong>{announcement.user.name}</strong>
                <span>{new Date(announcement.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <p>{announcement.message}</p>
            {(userRole === 'organizer' || userRole === 'collaborator') && (
              <button onClick={() => handleDeleteAnnouncement(announcement._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
