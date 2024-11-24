import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faMoneyBill, faComments } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BottomNav = ({ tripId, activeSection }) => {
  const navigate = useNavigate();

  return (
    <div className="outer-box">
      <div className="nav-box">
        {/* Trip Home */}
        <button
          className={`nav-item ${activeSection === "home" ? "active" : ""}`}
          onClick={() => navigate(`/trips/${tripId}`)}
        >
          <FontAwesomeIcon icon={faHome} className="nav-icon" />
          <span className="nav-text">Trip Home</span>
        </button>

        {/* Plans */}
        <button
          className={`nav-item ${activeSection === "plans" ? "active" : ""}`}
          onClick={() => navigate(`/trips/${tripId}/itinerary`)}
        >
          <FontAwesomeIcon icon={faMap} className="nav-icon" />
          <span className="nav-text">Plans</span>
        </button>

        {/* Expenses */}
        <button
          className={`nav-item ${activeSection === "expenses" ? "active" : ""}`}
          onClick={() => navigate(`/trips/${tripId}/expenses`)}
        >
          <FontAwesomeIcon icon={faMoneyBill} className="nav-icon" />
          <span className="nav-text">Expenses</span>
        </button>

        {/* Messages */}
        <button
          className={`nav-item ${activeSection === "messages" ? "active" : ""}`}
          onClick={() => navigate(`/trips/${tripId}/messages`)}
        >
          <FontAwesomeIcon icon={faComments} className="nav-icon" />
          <span className="nav-text">Messages</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
