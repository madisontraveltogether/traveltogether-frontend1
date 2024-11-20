import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faMoneyBillWave, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../css/BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate(); // Use the useNavigate hook
  const { tripId } = useParams();

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate(`/trips/${tripId}`)}>
        <FontAwesomeIcon icon={faHome} />
        <span>Trip Home</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/plans`)}>
        <FontAwesomeIcon icon={faMap} />
        <span>Plans</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/expenses`)}>
        <FontAwesomeIcon icon={faMoneyBillWave} />
        <span>Expenses</span>
      </button>
      <button onClick={() => navigate(`/trips/${tripId}/messages`)}>
        <FontAwesomeIcon icon={faEnvelope} />
        <span>Messages</span>
      </button>
    </div>
  );
};

export default BottomNav;
