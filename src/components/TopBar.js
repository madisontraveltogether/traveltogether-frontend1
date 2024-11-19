import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.topBar}>
      <img
        src="path-to-profile-picture.jpg"
        alt="Profile"
        style={styles.profilePic}
        onClick={() => navigate('/profile')}
      />
      <h1 style={styles.title}>{title}</h1>
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
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#FFFBF5',
    borderBottom: '1px solid #E0E0E0',
  },
  profilePic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
};

export default TopBar;
