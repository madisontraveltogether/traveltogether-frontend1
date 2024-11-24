import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faMoneyBill, faComments } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BottomNav.css'; // Ensure this file exists

const BottomNav = ({ tripId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a nav item is active
  const isActive = (path) => location.pathname === path;

  if (!tripId) {
    return <div>Invalid trip navigation. Please refresh or try again.</div>;
  }

  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${isActive(`/trips/${tripId}`) ? 'active' : ''}`}
        onClick={() => navigate(`/trips/${tripId}`)}
      >
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
        <span className="nav-text">Trip Home</span>
      </button>
      <button
        className={`nav-item ${isActive(`/trips/${tripId}/itinerary`) ? 'active' : ''}`}
        onClick={() => navigate(`/trips/${tripId}/itinerary`)}
      >
        <FontAwesomeIcon icon={faMap} className="nav-icon" />
        <span className="nav-text">Plans</span>
      </button>
      <button
        className={`nav-item ${isActive(`/trips/${tripId}/expenses`) ? 'active' : ''}`}
        onClick={() => navigate(`/trips/${tripId}/expenses`)}
      >
        <FontAwesomeIcon icon={faMoneyBill} className="nav-icon" />
        <span className="nav-text">Expenses</span>
      </button>
      <button
        className={`nav-item ${isActive(`/trips/${tripId}/messages`) ? 'active' : ''}`}
        onClick={() => navigate(`/trips/${tripId}/messages`)}
      >
        <FontAwesomeIcon icon={faComments} className="nav-icon" />
        <span className="nav-text">Messages</span>
      </button>
    </div>
  );
};

export default BottomNav;
