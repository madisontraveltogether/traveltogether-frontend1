import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faMoneyBill, faComments } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BottomNav = ({ tripId }) => {
  const navigate = useNavigate();

  if (!tripId) {
    console.error('Trip ID is missing in BottomNav');
    return null; // Prevent rendering if tripId is not available
  }

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate(`/trips/${tripId}`)}>
        <FontAwesomeIcon icon={faHome} /> <span>Home</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/plans`)}>
        <FontAwesomeIcon icon={faMap} /> <span>Plans</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>
        <FontAwesomeIcon icon={faMoneyBill} /> <span>Expenses</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/messages`)}>
        <FontAwesomeIcon icon={faComments} /> <span>Messages</span>
      </button>
    </div>
  );
};

export default BottomNav;
