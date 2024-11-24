import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faMoneyBill, faComments } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BottomNav = ({ tripId, activeSection }) => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav-box">
        {/* Trip Home */}
        <button
          className={activeSection === "home" ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}`)}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Trip Home</span>
        </button>

        {/* Plans */}
        <button
          className={activeSection === "plans" ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}/itinerary`)}
        >
          <FontAwesomeIcon icon={faMap} />
          <span>Plans</span>
        </button>

        {/* Expenses */}
        <button
          className={activeSection === "expenses" ? "active" : ""}
          onClick={() => navigate(`/trips/${tripId}/expenses`)}
        >
          <FontAwesomeIcon icon={faMoneyBill} />
          <span>Expenses</span>
        </button>

        {/* Messages */}
        <button
          className={activeSection === "messages" ? "active" : ""}
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
