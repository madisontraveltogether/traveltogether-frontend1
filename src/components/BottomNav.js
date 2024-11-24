import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faMoneyBill, faComments } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../css/BottomNav.css";

const BottomNav = ({ tripId, activeSection }) => {
  const navigate = useNavigate();

  if (!tripId) {
    return <div>Invalid trip navigation. Please refresh or try again.</div>;
  }

  const navItems = [
    { label: "Trip Home", icon: faHome, route: `/trips/${tripId}`, section: "home" },
    { label: "Plans", icon: faMap, route: `/trips/${tripId}/itinerary`, section: "plans" },
    { label: "Expenses", icon: faMoneyBill, route: `/trips/${tripId}/expenses`, section: "expenses" },
    { label: "Messages", icon: faComments, route: `/trips/${tripId}/messages`, section: "messages" },
  ];

  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.route)}
            className={`nav-item ${activeSection === item.section ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
