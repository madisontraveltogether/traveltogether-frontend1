import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <div style={styles.navContainer}>
      <NavLink to="/trip-home" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
        <img src="path-to-home-icon.png" alt="Home" style={styles.icon} />
        <span>Trip Home</span>
      </NavLink>
      <NavLink to="/plans" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
        <img src="path-to-plans-icon.png" alt="Plans" style={styles.icon} />
        <span>Plans</span>
      </NavLink>
      <NavLink to="/expenses" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
        <img src="path-to-expenses-icon.png" alt="Expenses" style={styles.icon} />
        <span>Expenses</span>
      </NavLink>
      <NavLink to="/messages" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
        <img src="path-to-messages-icon.png" alt="Messages" style={styles.icon} />
        <span>Messages</span>
      </NavLink>
    </div>
  );
};

const styles = {
  navContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0.5rem 0',
    backgroundColor: '#FFFBF5',
    borderTop: '1px solid #E0E0E0',
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#888',
    textDecoration: 'none',
  },
  activeLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#FFA500', // Active color (orange)
    textDecoration: 'none',
  },
  icon: {
    width: '24px',
    height: '24px',
    marginBottom: '0.2rem',
  },
};

export default BottomNav;
