import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMap, faMoneyBill, faComments } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();


  <div className="bottom-nav">
    <button onClick={() => navigate('/trips/${tripId}')}>
      <FontAwesomeIcon icon={faHome} /> Trip Home
    </button>
    <button onClick={() => navigate('/trips/${tripId}/plans')}>
      <FontAwesomeIcon icon={faMap} /> Plans
    </button>
    <button onClick={() => navigate('/trips/${tripId}/expenses')}>
      <FontAwesomeIcon icon={faMoneyBill} /> Expenses
    </button>
    <button onClick={() => navigate('/trips/${tripId}/messages')}>
      <FontAwesomeIcon icon={faComments} /> Messages
    </button>
  </div>
};

export default BottomNav;
