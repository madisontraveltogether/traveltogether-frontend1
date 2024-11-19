import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title, trips }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}/details`);
    setShowDropdown(false); // Close dropdown
  };

  return (
    <div style={styles.topBar}>
      <img
        src="path-to-profile-picture.jpg"
        alt="Profile"
        style={styles.profilePic}
        onClick={() => navigate('/profile')}
      />
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.myTripsContainer}>
        <button onClick={() => setShowDropdown(!showDropdown)} style={styles.myTripsButton}>
          My Trips
        </button>
        {showDropdown && (
          <div style={styles.dropdown}>
            {trips.length === 0 ? (
              <p>No trips found</p>
            ) : (
              trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => handleTripClick(trip.id)}
                  style={styles.dropdownItem}
                >
                  {trip.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <img
        src="path-to-bell-icon.png"
        alt="Notifications"
        style={styles.notificationIcon}
        onClick={() => navigate('/notifications')}
      />
    </div>
  );
};

const styles = {
  topBar: { /* same as before */ },
  profilePic: { /* same as before */ },
  title: { /* same as before */ },
  myTripsContainer: {
    position: 'relative',
  },
  myTripsButton: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: '0.5rem 1rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  notificationIcon: { /* same as before */ },
};

export default TopBar;
