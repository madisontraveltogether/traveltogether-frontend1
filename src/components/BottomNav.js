import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faMoneyBill, faComments } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = ({ tripId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav-box">
        <button
          className={isActive(`/trips/${tripId}`) ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}`)}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Trip Home</span>
        </button>
        <button
          className={isActive(`/trips/${tripId}/itinerary`) ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}/itinerary`)}
        >
          <FontAwesomeIcon icon={faMap} />
          <span>Plans</span>
        </button>
        <button
          className={isActive(`/trips/${tripId}/expenses`) ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}/expenses`)}
        >
          <FontAwesomeIcon icon={faMoneyBill} />
          <span>Expenses</span>
        </button>
        <button
          className={isActive(`/trips/${tripId}/messages`) ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}/messages`)}
        >
          <FontAwesomeIcon icon={faComments} />
          <span>Messages</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
