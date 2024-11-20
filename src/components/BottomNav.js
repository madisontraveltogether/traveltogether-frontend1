import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faMoneyBill, faComments } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BottomNav = ({ tripId }) => {
  const navigate = useNavigate();

  // Log the tripId to ensure it's being received correctly
  console.log('Trip ID in BottomNav:', tripId);

  if (!tripId) {
    console.error('Trip ID is missing in BottomNav');
    return <div>Invalid trip navigation. Please refresh or try again.</div>;
  }

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate(`/trips/${tripId}`)}>
        <FontAwesomeIcon icon={faHome} /> <span>Home</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/itinerary`)}>
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
