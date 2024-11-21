import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';

const TopBar = ({ title, trips, user }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTripClick = (tripId) => {
    navigate(`/trips/${tripId}`);
    setShowDropdown(false); // Close dropdown
  };

  return (
    <div style={styles.topBar}>
      {/* Profile Picture or Default Icon */}
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          style={styles.profilePic}
          onClick={() => navigate('/profile')}
        />
      ) : (
        <FontAwesomeIcon
          icon={faUserCircle}
          style={styles.profileIcon}
          onClick={() => navigate('/profile')}
        />
      )}

      {/* Page Title */}
      <h1 style={styles.title}>{title}</h1>

      {/* My Trips Dropdown */}
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

      {/* Notifications Icon */}
      <FontAwesomeIcon
        icon={faBell}
        style={styles.notificationIcon}
        onClick={() => navigate('/announcements')}
      />
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    background: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  profilePic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  profileIcon: {
    fontSize: '40px',
    color: '#ccc',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'center',
  },
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
  notificationIcon: {
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
  },
};

export default TopBar;
